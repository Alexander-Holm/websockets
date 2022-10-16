"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const enums_1 = require("./enums");
const server = new ws_1.WebSocketServer({ port: 443 });
console.log("Server started");
class User {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
    }
}
const connectedUsers = [];
server.on("connection", socket => {
    console.log("Socket connection");
    socket.on("message", message => {
        const { action, data } = JSON.parse(message.toString());
        //#region Error-handling
        const createError = (message) => JSON.stringify({ type: enums_1.MessageTypes.Error, data: message });
        if (!isUserConnected(socket) &&
            action !== enums_1.Actions.Connect) {
            const errorMsg = `You must first use the action: ${enums_1.Actions.Connect}, before using any other action`;
            const error = createError(errorMsg);
            socket.send(error);
            return;
        }
        if (isUserConnected(socket) &&
            action === enums_1.Actions.Connect) {
            const errorMsg = `User is already connected. If you want to change username use the action: ${enums_1.Actions.ChangeUsername}`;
            const error = createError(errorMsg);
            socket.send(error);
            return;
        }
        //#endregion
        switch (action) {
            case enums_1.Actions.Connect:
                let name = createUniqueName(data);
                const user = new User(name, socket);
                connectedUsers.push(user);
                broadcast(enums_1.MessageTypes.UserConnected, user.name);
                break;
            case enums_1.Actions.ChatMessage:
                broadcast(enums_1.MessageTypes.ChatMessage, data);
                break;
            case enums_1.Actions.ChangeUsername:
                break;
        }
    });
    socket.on("close", e => {
        const index = connectedUsers.findIndex(user => user.socket === socket);
        if (index < 0)
            return;
        const user = connectedUsers.splice(index, 1);
        broadcast(enums_1.MessageTypes.UserDisconnected, user[0].name);
    });
});
function broadcast(type, data) {
    const json = JSON.stringify({ type, data });
    connectedUsers.forEach(user => {
        user.socket.send(json);
    });
}
function isUserConnected(socket) {
    for (const user of connectedUsers) {
        if (user.socket == socket)
            return true;
    }
    return false;
}
function createUniqueName(name, iteration = 1) {
    connectedUsers.forEach(user => {
        if (user.name === name) {
            name += ` (${iteration})`;
            name = createUniqueName(name, iteration++);
        }
    });
    return name;
}
