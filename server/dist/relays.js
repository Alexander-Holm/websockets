"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relay = exports.Relays = void 0;
var Relays;
(function (Relays) {
    Relays["OnConnect"] = "on-connect";
    Relays["ChatMessage"] = "chat-message";
    Relays["UserConnected"] = "user-connected";
    Relays["UserDisconnected"] = "user-disconnected";
    Relays["UserList"] = "user-list";
    Relays["CanvasMessage"] = "canvas-message";
    Relays["Error"] = "error";
})(Relays = exports.Relays || (exports.Relays = {}));
// Kommunikation från servern
exports.Relay = {
    OnConnect(username) {
        const payload = { type: Relays.OnConnect, data: username };
        return JSON.stringify(payload);
    },
    ChatMessage(chatMessage) {
        const payload = { type: Relays.ChatMessage, data: chatMessage };
        return JSON.stringify(payload);
    },
    UserConnected(username) {
        const payload = { type: Relays.UserConnected, data: username };
        return JSON.stringify(payload);
    },
    UserDisconnected(username) {
        const payload = { type: Relays.UserDisconnected, data: username };
        return JSON.stringify(payload);
    },
    UserList(usernames) {
        const payload = { type: Relays.UserList, data: usernames };
        return JSON.stringify(payload);
    },
    CanvasMessage(canvasMessage) {
        const payload = { type: Relays.CanvasMessage, data: canvasMessage };
        return JSON.stringify(payload);
    },
    Error(message) {
        const payload = { type: Relays.Error, data: message };
        return JSON.stringify(payload);
    },
};
