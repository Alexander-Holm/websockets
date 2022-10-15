import { WebSocketServer, WebSocket } from "ws"
import { Actions, MessageTypes } from "./enums"

const server = new WebSocketServer( {port: 5050} );
console.log("server started")

class User{
    name: string;
    socket: WebSocket;
    constructor(name: string, socket: WebSocket){
        this.name = name;
        this.socket = socket;
    }
}
const connectedUsers: User[] = [];

server.on("connection", socket => {
    console.log("client connected")

    socket.on("message", message => {
        const { action, data } = JSON.parse(message.toString());

        //#region Error-handling
        const createError = (message:string) => JSON.stringify( { type: MessageTypes.Error, data: message } );
        if(
            !isUserConnected(socket) &&
            action !== Actions.Connect
        ){
            const errorMsg = `You must first use the action: ${Actions.Connect}, before using any other action`;
            const error = createError(errorMsg);
            socket.send(error);
            return;
        }
        if(
            isUserConnected(socket) &&
            action === Actions.Connect
        ){
            const errorMsg = `User is already connected. If you want to change username use the action: ${Actions.ChangeUsername}`;
            const error = createError(errorMsg);
            socket.send(error);
            return;
        }
        //#endregion

        switch(action){
            case Actions.Connect: 
                let name = createUniqueName(data);
                const user = new User(name, socket);
                connectedUsers.push(user);
                broadcast(MessageTypes.UserConnected, user.name);
                break;

            case Actions.ChatMessage:
                broadcast(MessageTypes.ChatMessage, data); 
                break;

            case Actions.ChangeUsername:
                break;

        }        
    })

    socket.on("close", e => {
        const index = connectedUsers.findIndex(user => user.socket === socket);
        if(index < 0)
            return;
        const user = connectedUsers.splice(index, 1);
        broadcast(MessageTypes.UserDisconnected, user[0].name);
    })

})

function broadcast(type:MessageTypes, data:any){
    const json = JSON.stringify( {type, data} );
    connectedUsers.forEach(user => {
        user.socket.send(json);
    })
}

function isUserConnected(socket:WebSocket): boolean {
    for(const user of connectedUsers){
        if(user.socket == socket)
            return true;
    }
    return false;
}

function createUniqueName(name:string, iteration:number = 1): string {
    connectedUsers.forEach(user => {
        if(user.name === name){
            name += ` (${iteration})`;
            name = createUniqueName(name, iteration++);
        }
    })
    return name;
}