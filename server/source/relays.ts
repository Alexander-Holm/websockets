import type { ICanvasMessage, IChatMessage } from "./types";

export enum Relays{
    OnConnect = "on-connect",
    ChatMessage = "chat-message",
    UserConnected = "user-connected",
    UserDisconnected = "user-disconnected",
    UserList = "user-list",
    CanvasMessage = "canvas-message",

    Error = "error",
}

// Kommunikation från servern
export const Relay = {
    OnConnect(username:string){
        const payload = { type: Relays.OnConnect, data: username };
        return JSON.stringify(payload);
    },
    ChatMessage(chatMessage: IChatMessage) {
        const payload = { type: Relays.ChatMessage, data: chatMessage };
        return JSON.stringify(payload);
    },
    UserConnected(username:string) {
        const payload = { type: Relays.UserConnected, data: username };
        return JSON.stringify(payload);
    },
    UserDisconnected(username:string) {
        const payload = { type: Relays.UserDisconnected, data: username };
        return JSON.stringify(payload);
    },
    UserList(usernames:string[]){
        const payload = { type: Relays.UserList, data: usernames };
        return JSON.stringify(payload);
    },
    CanvasMessage(canvasMessage: ICanvasMessage){
        const payload = { type: Relays.CanvasMessage, data: canvasMessage };
        return JSON.stringify(payload);
    },

    Error(message:string) {
        const payload = { type: Relays.Error, data: message };
        return JSON.stringify(payload);
    },
}

