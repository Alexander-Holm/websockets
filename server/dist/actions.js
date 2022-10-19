"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.Actions = void 0;
var Actions;
(function (Actions) {
    Actions["Connect"] = "connect";
    Actions["ChatMessage"] = "chat-message";
    Actions["GetConnectedUsers"] = "get-connected-users";
    Actions["CanvasMessage"] = "canvas-message";
})(Actions = exports.Actions || (exports.Actions = {}));
// Kommunikation till servern
exports.Action = {
    Connect(username) {
        const payload = { action: Actions.Connect, data: username };
        return JSON.stringify(payload);
    },
    ChatMessage(message) {
        const payload = { action: Actions.ChatMessage, data: message };
        return JSON.stringify(payload);
    },
    GetConnectedUsers() {
        const payload = { action: Actions.GetConnectedUsers };
        return JSON.stringify(payload);
    },
    CanvasMessage(canvasMessage) {
        const payload = { action: Actions.CanvasMessage, data: canvasMessage };
        return JSON.stringify(payload);
    }
};
