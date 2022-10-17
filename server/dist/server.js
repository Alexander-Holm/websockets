"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const actions_1 = require("./actions");
const relays_1 = require("./relays");
const server = new ws_1.WebSocketServer({ port: 5000 });
console.log("Server started");
class User {
    constructor(socket, name) {
        this.name = name;
        this.socket = socket;
    }
}
const connectedUsers = [];
server.on("connection", socket => {
    console.log("Socket connection");
    const user = new User(socket);
    socket.on("message", message => {
        const { action, data } = JSON.parse(message.toString());
        const error = handleErrors(user, action);
        if (error)
            return;
        switch (action) {
            case actions_1.Actions.Connect:
                user.name = createUniqueName(data);
                connectedUsers.push(user);
                broadcast(relays_1.Relay.UserConnected(user.name));
                break;
            case actions_1.Actions.ChatMessage:
                broadcast(relays_1.Relay.ChatMessage(data, user.name));
                break;
        }
    });
    socket.on("close", e => {
        const index = connectedUsers.findIndex(item => item === user);
        if (index < 0)
            return;
        connectedUsers.splice(index, 1);
        broadcast(relays_1.Relay.UserDisconnected(user.name));
    });
});
// send to all
function broadcast(json) {
    connectedUsers.forEach(user => {
        user.socket.send(json);
    });
}
function isUserConnected(user) {
    for (const item of connectedUsers) {
        if (item === user)
            return true;
    }
    return false;
}
function createUniqueName(name, iteration = 1) {
    connectedUsers.forEach(user => {
        if (user.name === name) {
            name += ` (${iteration + 1})`;
            name = createUniqueName(name, iteration++);
        }
    });
    return name;
}
// Returnerar true om det finns ett error
function handleErrors(user, action) {
    let error = false;
    if (!isUserConnected(user) &&
        action !== actions_1.Actions.Connect) {
        const errorMsg = `You must first use the action: ${actions_1.Actions.Connect}, before using any other action`;
        // const error = createError(errorMsg);
        user.socket.send(relays_1.Relay.Error(errorMsg));
        error = true;
    }
    if (isUserConnected(user) &&
        action === actions_1.Actions.Connect) {
        const errorMsg = `User is already connected`;
        // const error = createError(errorMsg);
        user.socket.send(relays_1.Relay.Error(errorMsg));
        error = true;
    }
    return error;
}
