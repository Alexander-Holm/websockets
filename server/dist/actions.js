"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.Actions = void 0;
// string enums för att lättare läsa och debugga websocket-anropen
var Actions;
(function (Actions) {
    Actions["Connect"] = "connect";
    Actions["ChatMessage"] = "chat-message";
    Actions["GetConnectedUsers"] = "get-connected-users";
})(Actions = exports.Actions || (exports.Actions = {}));
// Kommunikation till servern
exports.Action = {
    Connect: (username) => {
        const payload = { action: Actions.Connect, data: username };
        return JSON.stringify(payload);
    },
    ChatMessage: (message) => {
        const payload = { action: Actions.ChatMessage, data: message };
        return JSON.stringify(payload);
    },
    GetConnectedUsers: () => {
        const payload = { action: Actions.GetConnectedUsers };
        return JSON.stringify(payload);
    }
};
