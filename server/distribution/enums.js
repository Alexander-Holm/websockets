"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actions = exports.MessageTypes = void 0;
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["ChatMessage"] = "chat-message";
    MessageTypes["UserConnected"] = "user-connected";
    MessageTypes["UserDisconnected"] = "user-disconnected";
    MessageTypes["NameChange"] = "username-changed";
    MessageTypes["Error"] = "error";
})(MessageTypes = exports.MessageTypes || (exports.MessageTypes = {}));
var Actions;
(function (Actions) {
    Actions["Connect"] = "connect";
    Actions["ChangeUsername"] = "change-username";
    Actions["ChatMessage"] = "chat-message";
})(Actions = exports.Actions || (exports.Actions = {}));
