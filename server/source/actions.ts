// string enums för att lättare läsa och debugga websocket-anropen
export enum Actions {
    Connect = "connect",
    ChatMessage = "chat-message",
    GetConnectedUsers= "get-connected-users",
} 

// Kommunikation till servern
export const Action = {
    Connect: (username:string) => {
        const payload = { action: Actions.Connect, data: username };
        return JSON.stringify(payload);
    },
    ChatMessage: (message:string) => {
        const payload = { action: Actions.ChatMessage, data: message };
        return JSON.stringify(payload);
    },
    GetConnectedUsers: () => {
        const payload = { action: Actions.GetConnectedUsers};
        return JSON.stringify(payload);
    }
}