<script lang="ts">
    import { onMount } from "svelte";
    import { ICONS } from "./icons"
    import { Emojis } from "@server/enums"
    import { Action } from "@server/actions";
    import { Relays } from "@server/relays"
    import { CanvasElement } from "./CanvasElement";
    import EmojiButton from "./EmojiButton.svelte";

    export let socket: WebSocket;
    socket.addEventListener("message", receiveMessage);

    let canvas: HTMLCanvasElement;

    let selectedEmoji: Emojis | null = null;
    function clickEmoji(clickedEmoji: string){
        console.log(clickedEmoji in Emojis)
        if(clickedEmoji === selectedEmoji){
            selectedEmoji = null;
            return;
        }
        selectedEmoji = clickedEmoji as Emojis;
    } 

    // Lägger element i in[] och out[] för att köra transitions 
    // på det när det läggs till eller tas bort från canvas
    class CanvasElements { 
        in: CanvasElement[] = [];
        static: CanvasElement[] = [];
        out: CanvasElement[] = [];
    }
    let canvasElements = new CanvasElements();
    // Tid som ett element visas på canvas mellan transitions i ms
    const ELEMENT_TIMER = 5000;

    
    /* 
        Storleken på canvas sätts i procent av CSS.
        Det ändrar inte den faktiska storleken på canvas utan sträcker bara ut den.
        Måste därför med Javascript sätta storleken till det värde i px som CSS räknar ut.

        https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
        Phrogz answered Apr 18, 2012 at 18:34 
    */
    onMount(() => {
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
            let context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);

            canvasElements.in.forEach(item => {
                item.opacity += 0.1;
                if(item.opacity < 1){
                    item.draw(context);
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
                item.draw(context)
            })
    
            canvasElements.out.forEach(item => {
                item.opacity -= 0.1;
                if(item.opacity > 0){
                    item.draw(context);
                }
                else {
                    canvasElements.out = canvasElements.out.filter(x => x !== item);
                }            
            })
            
            // Uppdatera canvas nästa frame om det finns element som har pågående transition,
            // behöver inte måla om canvas ifall det endast finns static elements.
            if(canvasElements.in.length > 0 || canvasElements.out.length > 0)
                drawCanvas();
        });
    }

    function sendMessage(event: MouseEvent){
        if(selectedEmoji == null) return;

        const canvasRect = canvas.getBoundingClientRect();
        // left och top är avstånd från canvas till kanten av fönstret
        const clickX = event.x - canvasRect.left;
        const clickY = event.y - canvasRect.top;
        const xPercent = clickX / canvasRect.width;
        const yPercent = clickY / canvasRect.height;

        const payload = Action.CanvasMessage( { emoji: selectedEmoji, xPercent, yPercent } );
        socket.send(payload);
        selectedEmoji = null;
    }
    function receiveMessage(websocketMessage: MessageEvent<any>){
        const { type, data} = JSON.parse(websocketMessage.data);
        if(type !== Relays.CanvasMessage) return;
        
        const { emoji, xPercent, yPercent, username } = data;

        const svg = ICONS[emoji];
        const img = new Image();        
        img.src = "data:image/svg+xml," + encodeURIComponent(svg);
        img.onload = () => {
            const newItem = new CanvasElement(username, img, xPercent, yPercent);
            canvasElements.in = [...canvasElements.in, newItem];
            drawCanvas();
        }
    }   
</script>

<section id="canvas" class="grid">
    <canvas bind:this={canvas} on:click={sendMessage} />
    <div id="emoji-selection">
        <h3>Send an emoji on the screen</h3>
        <div class="buttons">
            {#each Object.entries(ICONS) as [key, value], index}
                <EmojiButton 
                    active={selectedEmoji === key} 
                    borderRotation={index * 90} 
                    on:click={() => clickEmoji(key)} 
                >
                    {@html value}
                </EmojiButton>
            {/each}
        </div>
    </div>
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
        height: 100%;
        width: 100%;

        background: 
            linear-gradient(hsla(0, 0%, 100%, 0.9) 50%, hsla(0, 0%, 100%, 0.8) 50%),
            linear-gradient(90deg, red, green, blue);
        background-size: 
            100% 5px, 
            15px 110%;
        animation: scroll 15s infinite linear;

        border: 4px solid hsl(0, 0%, 20%);
        border-radius: 5% / 50%;
        box-shadow: 0 0 40px #d9f8ff;
        box-sizing: border-box;

    }
        @keyframes scroll{
            from{ background-position-y: top; }
            to{ background-position-y: bottom; }
        }
        @media(prefers-reduced-motion){
            canvas{
                background:white;
            }
        }


    #emoji-selection{
        display: flex;
        flex-direction: column;
        align-items: center;
    }    
    h3{
        font-size: 2.5rem;
        font-family: dash;

        color: transparent;
        background: linear-gradient( rgb(131, 221, 249) 20%, rgb(135, 80, 255) 60%, #e852f4 60%, rgb(254, 216, 255) 80% );
        background-clip: text;
        filter: drop-shadow(3px 5px #0f0037);

        /* gradient blir fel om texten är mer än en rad */
        white-space: nowrap;
    }
    .buttons{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3rem;
    }
</style>