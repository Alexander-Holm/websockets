<script lang="ts">
    import ChatMessage from "./ChatMessage.svelte";
    import { Action } from "@server/actions";
    import { Relays } from "@server/relays";
    import type { IChatMessage } from "@server/types";
    import UserList from "./UserList.svelte";
    
    export let socket: WebSocket;
    export let name: string;
    
    let chatMessages: IChatMessage[] = [];
    let chatInput = "";
    // Svelte känner inte av när en array ändras av funktioner som push() och splice().
    // Måste använda array = någonting, 
    // t.ex. array = [...array, newItem] eller array = array.filter()
    let users: string[] = [];

    socket.onmessage = message => {
        const { type, data } = JSON.parse(message.data as string);
        switch(type){
            case Relays.ChatMessage: 
                chatMessages = [...chatMessages, data as IChatMessage];
                break;

            case Relays.UserList: users = data; break;
            case Relays.UserConnected: users = [...users, data]; break;
            case Relays.UserDisconnected: users = users.filter(user => user !== data); break;
        }
    }

    socket.send(Action.GetConnectedUsers());

    function sendMessage(){
        socket.send(Action.ChatMessage(chatInput));
        chatInput = "";
    }
</script>

<section id="chat" class="grid">

    <div class="message-container">
        <div class="header">
            <h2>{name}</h2>
            <UserList usernames={users} />
        </div>
        <div class="chat-messages">
            {#each chatMessages as item}
                <ChatMessage user={item.username} message={item.message} />
            {/each }
        </div>
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
    }
    .message-container{
        /* overflow:hidden för att få scrollbar på chatten som har overflow:auto */
        overflow: hidden;

        padding: 1rem;        
        border: 1px solid gray;
        border-radius: var(--border-radius);
    }
    .header{
        position: relative;
        text-align: center;
    }
    .chat-messages{
        overflow-y: auto;
        scrollbar-width: thin;        
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
        background-color: rgb(57, 117, 227);
        color: white;
        font-size: 1rem;        
    }
</style>