// string enums för att lättare läsa och debugga websocket-anropen
export enum Relays{
    ChatMessage = "chat-message",
    UserConnected = "user-connected",
    UserDisconnected = "user-disconnected",
    UserList = "user-list",

    Error = "error",
}

// Kommunikation från servern
export const Relay = {
    ChatMessage: (message:string, username:string) => {
        const data: IChatMessage = { message, username };
        const payload = { type: Relays.ChatMessage, data };
        return JSON.stringify(payload);
    },
    UserConnected: (username:string) => {
        const payload = { type: Relays.UserConnected, data: username };
        return JSON.stringify(payload);
    },
    UserDisconnected: (username:string) => {
        const payload = { type: Relays.UserDisconnected, data: username };
        return JSON.stringify(payload);
    },
    UserList(usernames:string[]){
        const payload = { type: Relays.UserList, data: usernames };
        return JSON.stringify(payload);
    },

    Error: (message:string) => {
        const payload = { type: Relays.Error, data: message };
        return JSON.stringify(payload);
    },
}

export interface IChatMessage{ message:string, username:string }