"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relay = exports.Relays = void 0;
// string enums för att lättare läsa och debugga websocket-anropen
var Relays;
(function (Relays) {
    Relays["ChatMessage"] = "chat-message";
    Relays["UserConnected"] = "user-connected";
    Relays["UserDisconnected"] = "user-disconnected";
    Relays["UserList"] = "user-list";
    Relays["Error"] = "error";
})(Relays = exports.Relays || (exports.Relays = {}));
// Kommunikation från servern
exports.Relay = {
    ChatMessage: (message, username) => {
        const data = { message, username };
        const payload = { type: Relays.ChatMessage, data };
        return JSON.stringify(payload);
    },
    UserConnected: (username) => {
        const payload = { type: Relays.UserConnected, data: username };
        return JSON.stringify(payload);
    },
    UserDisconnected: (username) => {
        const payload = { type: Relays.UserDisconnected, data: username };
        return JSON.stringify(payload);
    },
    UserList(usernames) {
        const payload = { type: Relays.UserList, data: usernames };
        return JSON.stringify(payload);
    },
    Error: (message) => {
        const payload = { type: Relays.Error, data: message };
        return JSON.stringify(payload);
    },
};
