import { WebSocketServer, WebSocket } from "ws"
import { Actions } from "./actions";
import { Relay } from "./relays"
import type { ICanvasMessage } from "./types";


interface IUser{ name?:string, socket:WebSocket}
const connectedUsers: IUser[] = []

const server = new WebSocketServer( { port: 5000 } );
server.on("listening", () => {console.log("Server listening")} );
server.on("error", (e) => console.log("Server error!", e));

server.on("connection", socket => {
    console.log("Socket connection");
    const user: IUser = { socket };

    socket.on("message", message => {
        const { action, data } = JSON.parse(message.toString());

        const error = handleErrors(user, action);
        if(error) return;

        switch(action){
            case Actions.Connect:
                user.name = createUniqueName(data);
                connectedUsers.push(user);
                socket.send(Relay.OnConnect(user.name));
                broadcast(Relay.UserConnected(user.name));
                console.log("User connected: " + user.name)
                break;

            case Actions.ChatMessage:
                broadcast(Relay.ChatMessage( { message: data, username: user.name! } )); 
                break;

            case Actions.GetConnectedUsers:
                const usernames = connectedUsers.map(user => user.name!);
                socket.send(Relay.UserList(usernames));
                break;

            case Actions.CanvasMessage:
                const canvasMessage = data as ICanvasMessage;
                canvasMessage.username = user.name;
                broadcast(Relay.CanvasMessage(canvasMessage));
                break;
        }        
    })


    socket.on("close", e => {
        // Om socket är ansluten utan användarnamn,
        // dvs. har inte använt Actions.Connect och finns inte i connectedUsers[],
        // behöver då inte meddela andra att socket stängs.
        const index = connectedUsers.findIndex(item => item === user);
        if(index < 0) return;
        
        connectedUsers.splice(index, 1);
        broadcast(Relay.UserDisconnected(user.name!));
        console.log("Socket close")
    })

})

// send to all
function broadcast(json:string){
    connectedUsers.forEach(user => {
        user.socket.send(json);
    })
}

function isUserConnected(user:IUser): boolean{
    for(const item of connectedUsers){
        if(item === user)
            return true;
    }
    return false;
}

function createUniqueName(name:string, iteration:number = 1): string {
    connectedUsers.forEach(user => {
        if(user.name === name){
            name += ` (${iteration + 1})`;
            name = createUniqueName(name, iteration++);
        }
    })
    return name;
}

// Returnerar true om det finns ett error
function handleErrors(user:IUser, action:Actions): boolean{
    let error = false;

    // Försöker använda andra Actions innan Actions.Connect
    if(
        !isUserConnected(user) &&
        action !== Actions.Connect
    ){
        const errorMsg = `You must first use the action: ${Actions.Connect}, before using any other action`;
        user.socket.send(Relay.Error(errorMsg));
        error = true;
    }

    // Actions.Connect har redan använts
    if(
        isUserConnected(user) &&
        action === Actions.Connect
    ){
        const errorMsg = `User is already connected`;
        user.socket.send(Relay.Error(errorMsg));
        error = true;
    }

    return error;
}