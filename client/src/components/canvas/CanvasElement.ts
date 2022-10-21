export class CanvasElement { 
    text: string;
    image: HTMLImageElement;
    // x, y är procent i decimalform, 0 till 1
    position: { xPercent:number; yPercent:number; }
    opacity = 0;
    constructor(text:string, image:HTMLImageElement, xPercent:number, yPercent:number){
        this.text = text;
        this.image = image;
        this.position = { xPercent, yPercent};
    }
    draw(ctx: CanvasRenderingContext2D){
        const xCoordinate = ctx.canvas.width * this.position.xPercent;
        const yCoordinate = ctx.canvas.height * this.position.yPercent;

        ctx.beginPath();
        ctx.globalAlpha = this.opacity;

        // Icon
        const iconSize = 70;
        const halfSize = iconSize / 2;
        const centeredX = xCoordinate - halfSize;
        const centeredY = yCoordinate - halfSize;
        ctx.drawImage(this.image, centeredX, centeredY, iconSize, iconSize);

        // Text
        const fontSize = 22; //px
        ctx.font = `${fontSize}px comic sans MS`;
        ctx.fillStyle = "black"
        ctx.textAlign = "center";
        const offsetY = halfSize + fontSize;
        ctx.fillText(this.text, xCoordinate , yCoordinate+offsetY);

        ctx.closePath();
    }
}