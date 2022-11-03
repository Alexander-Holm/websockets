<script lang="ts">
    import { onMount } from "svelte";
    import CanvasSettings from "./EmojiButtons.svelte";
    import { No, Write, Yes } from "./emojis"
    import { Emojis } from "@server/enums"
    import { Action } from "@server/actions";
    import { Relays } from "@server/relays"
    import { CanvasElement } from "./CanvasElement";

    export let socket: WebSocket;

    let canvas: HTMLCanvasElement;
    let selectedIcon: Emojis | null = null;
    socket.addEventListener("message", receiveMessage);

    // Lägger element i in[] och out[] för att köra transitions på det,
    // när det läggs till eller tas bort från canvas
    class CanvasElements { 
        in: CanvasElement[] = [];
        static: CanvasElement[] = [];
        out: CanvasElement[] = [];
    }
    let canvasElements = new CanvasElements();
    // Tid som ett element visas på canvas mellan transitions
    const ELEMENT_TIMER = 5000;

    // onMount för att canvas inte ska vara undefined.
    onMount(() => {
        /* 
            Storleken på canvas sätts i procent av CSS.
            Det ändrar inte den faktiska storleken på canvas utan sträcker bara ut den.
            Måste därför med Javascript sätta storleken till det värde i px som CSS räknar ut.

            https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
            Phrogz answered Apr 18, 2012 at 18:34 
        */
        function resizeHandler() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            drawCanvas();
        }
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
    })

    function drawCanvas(){
        if(canvas == null) return;
        
        requestAnimationFrame(() => {            
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            canvasElements.in.forEach(item => {
                item.opacity += 0.1;
                if(item.opacity < 1){
                    item.draw(ctx);
                }
                else{
                    item.opacity = 1;
                    // Transition in är klar
                    // Flytta item från in till static
                    const index = canvasElements.in.indexOf(item);
                    canvasElements.in.splice(index, 1);
                    canvasElements.static.push(item);
                    // Efter timer börja transition out
                    setTimeout(() => {
                        const index = canvasElements.static.indexOf(item)
                        canvasElements.static.splice(index, 1);
                        canvasElements.out = [...canvasElements.out, item];
                        drawCanvas();
                    }, ELEMENT_TIMER);
                }
            })
    
            canvasElements.static.forEach(item => {
                item.draw(ctx)
            })
    
            canvasElements.out.forEach(item => {
                item.opacity -= 0.1;
                if(item.opacity > 0){
                    item.draw(ctx);
                }
                else {
                    canvasElements.out = canvasElements.out.filter(x => x !== item);
                }            
            })
            
            if(canvasElements.in.length > 0 || canvasElements.out.length > 0)
                drawCanvas();
        });

    }


    function sendMessage(event: MouseEvent){
        if(selectedIcon == null) return;

        const canvasRect = canvas.getBoundingClientRect();
        // left och top är avstånd från canvas till kanten av fönstret
        const clickX = event.x - canvasRect.left;
        const clickY = event.y - canvasRect.top;
        const xPercent = clickX / canvasRect.width;
        const yPercent = clickY / canvasRect.height;

        const payload = Action.CanvasMessage( { emoji: selectedIcon, xPercent, yPercent } );
        socket.send(payload);
        selectedIcon = null;
    }
    function receiveMessage(websocketMessage: MessageEvent<any>){
        const { type, data} = JSON.parse(websocketMessage.data);
        if(type !== Relays.CanvasMessage) return;
        
        const { emoji, xPercent, yPercent, username } = data

        let svg:string; // string av SVG, "<svg> </svg"
        switch(emoji as Emojis){
            case Emojis.Yes: svg = Yes; break;
            case Emojis.No: svg = No; break;
            case Emojis.Write: svg = Write; break;
        }
        const img = new Image();
        img.src = "data:image/svg+xml," + encodeURIComponent(svg);
        img.onload = () => {
            const newItem = new CanvasElement(username, img, xPercent, yPercent);
            canvasElements.in = [...canvasElements.in, newItem];
            drawCanvas()
        }
    }   
</script>

<section id="canvas" class="grid">
    <canvas bind:this={canvas} on:click={sendMessage} />
    <CanvasSettings bind:selected={selectedIcon} />
</section>

<style>
    /* .grid från global */
    
    #canvas{
        flex: 1;
        height: 100%;
        width: 100%;
        max-width: 800px;
    }
    canvas{
        --outline-width: 4px;

        height: 100%;
        width: 100%;
        box-sizing: border-box;

        outline: var(--outline-width) dotted #d8fff9;
        outline-offset: calc( (var(--outline-width) / 2)  *-1 );
        box-shadow: 
            0 0 calc(var(--outline-width) *2) #59e0ff, 
            0 0 calc(var(--outline-width) *2) #59e0ff inset;

        background: white;
        /* Transparent padding (border-radius fungerar inte) */
        background-clip: content-box;
        padding: calc(var(--outline-width) *2);
    }
</style>