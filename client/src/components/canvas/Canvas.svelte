<script lang="ts">
    import { onMount } from "svelte";
    import CanvasSettings from "./EmojiButtons.svelte";
    import { No, Write, Yes } from "./emojis"
    import { Emojis } from "@server/enums"
    import { Action } from "@server/actions";
    import { Relays } from "@server/relays"

    export let socket: WebSocket;

    let canvas: HTMLCanvasElement;
    let canvasRect: DOMRect;
    let selectedIcon: Emojis | null = null;
    socket.addEventListener("message", receiveMessage);

    class CanvasElement { 
        text: string;
        image: HTMLImageElement;
        // x, y är procent i decimalform, 0 till 1
        xPercent:number; yPercent:number;
        constructor(text:string, image:HTMLImageElement, xPercent:number, yPercent:number){
            this.text = text;
            this.image = image;
            this.xPercent = xPercent;
            this.yPercent = yPercent;
        }
    }
    let canvasElements: CanvasElement[] = [];
    $: { drawCanvas(canvasElements) }

    onMount(() => {
        // Storleken på canvas sätts i procent av CSS.
        // För att koordinaterna ska fungera måste man sätta storleken i js också.
        // https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
        // Phrogz answered Apr 18, 2012 at 18:34 
        function resizeHandler() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            canvasRect = canvas.getBoundingClientRect();
            drawCanvas(canvasElements);
        }
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
    })

    function drawCanvas(canvasElements:CanvasElement[]){
        if(canvas == null) return;
        
        let ctx = canvas.getContext("2d");        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvasElements.forEach(item => {
            const x = canvasRect.width * item.xPercent;
            const y = canvasRect.height * item.yPercent;
 
            // Icon
            const iconSize = 70;
            const halfSize = iconSize / 2;
            const centeredX = x - halfSize;
            const centeredY = y - halfSize;
            ctx.drawImage(item.image, centeredX, centeredY, iconSize, iconSize);

            // Text
            const fontSize = 22; //px
            ctx.font = `${fontSize}px comic sans MS`;
            ctx.fillStyle = "black"
            ctx.textAlign = "center";
            const offsetY = halfSize + fontSize;
            ctx.fillText(item.text, x , y+offsetY);
        })
    }

    function sendMessage(event: MouseEvent){
        if(selectedIcon == null) return;        

        const clickX = event.x - canvasRect.x;
        const clickY = event.y - canvasRect.y;
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
            canvasElements = [...canvasElements, newItem];
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
        max-width: 1000px;
    }
    canvas{
        height: 100%;
        width: 100%;
        box-sizing: border-box;

        background-color: #f4f4f4;
        border: 2px solid #757575;
        border-radius: 5px;
    }
</style>