import type { ICanvasMessage } from "./types";

export enum Actions {
    Connect = "connect",
    ChatMessage = "chat-message",
    GetConnectedUsers = "get-connected-users",
    CanvasMessage = "canvas-message",
} 

// Kommunikation till servern
export const Action = {
    Connect(username:string) {
        const payload = { action: Actions.Connect, data: username };
        return JSON.stringify(payload);
    },
    ChatMessage(message:string) {
        const payload = { action: Actions.ChatMessage, data: message };
        return JSON.stringify(payload);
    },
    GetConnectedUsers() {
        const payload = { action: Actions.GetConnectedUsers};
        return JSON.stringify(payload);
    },
    CanvasMessage(canvasMessage: ICanvasMessage) {
        const payload = { action: Actions.CanvasMessage, data: canvasMessage };
        return JSON.stringify(payload);
    }
}