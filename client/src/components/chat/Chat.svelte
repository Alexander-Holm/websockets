<script lang="ts">
    import ChatMessage from "./ChatMessage.svelte";
    import { Action } from "@server/actions";
    import { Relays } from "@server/relays";
    import type { IChatMessage } from "@server/types";
    import { fade, fly, scale } from "svelte/transition";
    import Header from "./Header.svelte";
    import { Enter, Exit, Message, User, UserList } from "./icons";
    
    export let socket: WebSocket;
    export let name: string;
    
    let userlistToggled = false;
    let chatMessages: IChatMessage[] = [];
    let chatInput = "";
    // Svelte känner inte av när en array ändras av funktioner som push() och splice().
    // Måste använda array = någonting, 
    // t.ex. array = [...array, newItem] eller array = array.filter()
    let users: string[] = [];

    let newMessages = 0;

    class ConnectionPopup {
        username:string;
        svgString: string;
        status: string;
        constructor(username:string, status:Relays.UserConnected | Relays.UserDisconnected){
            this.username = username;
            switch(status){
                case Relays.UserConnected: 
                    this.status = "connected";
                    this.svgString = Enter;
                    break;
                case Relays.UserDisconnected: 
                    this.status = "disconnected";
                    this.svgString = Exit;
                    break;
            }
        }
    }
    let connectionPopups: ConnectionPopup[] = [];
    let popupTimer: NodeJS.Timeout;
    // $: { 
    //     if(connectionPopups.length > 0 && popupTimer == null){
    //         popupTimer = setTimeout(() => {
    //             connectionPopups.splice(0, 1);
    //             connectionPopups = connectionPopups;
    //             popupTimer = null;
    //         }, 2000); 
    //     }
    // }

    socket.addEventListener("message", message => {
        const { type, data } = JSON.parse(message.data);
        switch(type){
            case Relays.ChatMessage: 
                chatMessages = [...chatMessages, data as IChatMessage];
                newMessages++;
                break;

            case Relays.UserList: users = data; break;
            case Relays.UserConnected: 
                users = [...users, data]; 
                if(userlistToggled === false && data !== name){
                    connectionPopups = [... connectionPopups, new ConnectionPopup(data, type)]
                }
                break;
            case Relays.UserDisconnected: 
                users = users.filter(user => user !== data); 
                if(userlistToggled === false && data !== name){
                    connectionPopups = [... connectionPopups, new ConnectionPopup(data, type)]
                }
                break;
        }
    })

    socket.send(Action.GetConnectedUsers());

    function sendMessage(){
        socket.send(Action.ChatMessage(chatInput));
        chatInput = "";
        userlistToggled = false;
    }

    function toggleView(){
        newMessages = 0;
        connectionPopups = [];
        userlistToggled = !userlistToggled;
    }

</script>

<section id="chat" class="grid">

    <div class="content-container">

    

    {#if !userlistToggled}
        {#if connectionPopups.length > 0}
            <div class="popup" transition:scale|local >
                <span class="text">
                    <strong>{connectionPopups[0].username}</strong>&nbsp;
                    {connectionPopups[0].status}
                </span>
                <span class="icon">{@html connectionPopups[0].svgString}</span>
            </div>
        {/if}

        <Header text={name} icon={UserList} iconTooltip="Connected users" clickIcon={toggleView} />

        <div id="chat-messages" class="content" in:fade|local>
            {#each chatMessages as item}
            <ChatMessage user={item.username} message={item.message} />
            {/each }
        </div>

    {/if}


    
    {#if userlistToggled}
        {#if newMessages > 0}
        
        <div class="popup" transition:scale|local >
            <span class="icon">{@html Message}</span>
            <span class="text" >
                +
                {#key newMessages}
                <span in:fly|local={{y: -200, opacity: 0, duration: 2000}} >{newMessages}</span>            
                {/key}
                new messages
            </span>
        </div>
        {/if}
    
        <Header text="Connected users" icon={Message} iconTooltip="Chat" clickIcon={toggleView} />
        
        <div id="connected-users" class="content" in:fade|local>
            {#each users as user}
                <span class="username" >
                    {#if user === name}
                    <strong>(You) </strong>
                    {/if}
                    {user}
                </span>
            {/each}
        </div>  
    {/if}

    </div>

    <form class="chat-input" on:submit|preventDefault={sendMessage}>
        <input type="text" placeholder="..." bind:value={chatInput} required  />
        <button id="submit-chat-message" type="submit" >Send</button>
    </form>

</section>


<style>
    /* .grid från global */

    #chat{
        --border-radius: 4px;

        height: 100%;
        flex-basis: 15rem;

        position: relative;
    }

    .content-container{
        /* Måste ha flex eller height för att få scrollbar att fungera */
        display: flex;
        flex-direction: column;
        /* overflow:hidden för att få scrollbar på chatten som har overflow:auto */
        overflow: hidden;   
        border: 1px solid gray;
        border-radius: var(--border-radius);
    }
    .content{        
        overflow-y: auto;
        scrollbar-width: thin;
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }
    #connected-users .username{
        overflow-wrap: anywhere;
        padding-block: 0.5rem;
    } 


    .chat-input{
        display: flex;
        gap: 3px;

        max-height: 3rem;
        border: 1px solid gray;
        border-radius: var(--border-radius);
    }
    .chat-input input{
        flex-grow: 1;
        padding-inline: 1rem;
        border: 0;
        border-radius: inherit;
    }
    #submit-chat-message{
        padding: 6px 16px;
        border: 0;
        background-color: var(--blue);
        color: white;
        font-size: 1rem;        
    }
        #submit-chat-message:hover {
            filter: brightness(1.1);
        }
        #submit-chat-message:active {
            box-shadow: 0 0 4px black inset;
        }


    /* Popup */
    .popup{
        position: absolute;
        top: -3rem; right: 0;

        display: flex;
        align-items: center;
        height: 2.5rem;
        /* Texten växer i bredd istället för wrap */
        width: max-content;
        max-width: 100%;

        /* Backgrund för att popupen kan täcka h1 */
        background-image: linear-gradient(90deg, #f2f2f2, white);
        border-radius: 10px;
    }
    .popup .icon{
        height: 100%; 
        aspect-ratio: 1;
    }
    .popup .text{
        padding-inline: 1rem;
    }
</style>