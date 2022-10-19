import type { Emojis } from "./enums";

export interface ICanvasMessage {
    emoji: Emojis,
    xPercent: number
    yPercent: number,
    username?: string,
}

export interface IChatMessage { 
    message:string, 
    username:string 
}