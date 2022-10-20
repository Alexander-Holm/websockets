<script lang="ts">
    import ChatMessage from "./ChatMessage.svelte";
    import { Action } from "@server/actions";
    import { Relays } from "@server/relays";
    import type { IChatMessage } from "@server/types";
    import { fade } from "svelte/transition";
    import Header from "./Header.svelte";
    
    export let socket: WebSocket;
    export let name: string;
    
    let userlistToggled = false;
    let chatMessages: IChatMessage[] = [];
    let chatInput = "";
    // Svelte känner inte av när en array ändras av funktioner som push() och splice().
    // Måste använda array = någonting, 
    // t.ex. array = [...array, newItem] eller array = array.filter()
    let users: string[] = [];

    socket.addEventListener("message", message => {
        const { type, data } = JSON.parse(message.data);
        switch(type){
            case Relays.ChatMessage: 
                chatMessages = [...chatMessages, data as IChatMessage];
                break;

            case Relays.UserList: users = data; break;
            case Relays.UserConnected: users = [...users, data]; break;
            case Relays.UserDisconnected: users = users.filter(user => user !== data); break;
        }
    })

    socket.send(Action.GetConnectedUsers());

    function sendMessage(){
        socket.send(Action.ChatMessage(chatInput));
        chatInput = "";
        userlistToggled = false;
    }

</script>

<section id="chat" class="grid">

    <div class="content-container">
        <Header bind:userlistToggled={userlistToggled} username={name} />

        {#if userlistToggled === false}
        <div id="chat-messages" class="content" in:fade|local>
            {#each chatMessages as item}
                <ChatMessage user={item.username} message={item.message} />
            {/each }
        </div>            
        {/if}

        {#if userlistToggled}
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
        background-color: rgb(57, 117, 227);
        color: white;
        font-size: 1rem;        
    }
</style>