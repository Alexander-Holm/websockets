<script lang="ts">
    import ChatMessage from "./ChatMessage.svelte";
    import { Action } from "@server/actions";
    import { IChatMessage, Relays } from "@server/relays";
    
    export let socket: WebSocket;

    let chatMessages: IChatMessage[] = [];
    let chatInput = "";

    socket.onmessage = message => {
        const { type, data } = JSON.parse(message.data as string);
        switch(type){
            case Relays.ChatMessage: 
                // Kan inte använda array.push(), Svelte känner inte av ändringar av .push()                
                chatMessages = [...chatMessages, data as IChatMessage];
                break;
        }
    }

    function sendMessage(){
        socket.send(Action.ChatMessage(chatInput));
        chatInput = "";
    }
</script>

<section id="chat-container">
    <div id="chat-messages">
        {#each chatMessages as item}
            <ChatMessage user={item.username} message={item.message} />
        {/each }
    </div>
    <form id="chat-input" on:submit|preventDefault={sendMessage}>
        <input type="text" placeholder="..." bind:value={chatInput} required  />
        <button id="submit-chat-message" type="submit" >Send</button>
    </form>
</section>


<style>
    #chat-container{
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 50rem; max-width: 100%;
        margin: auto;
    }
    #chat-messages{
        overflow-y: auto;
        scrollbar-width: thin;

        flex: 1;
        padding: 1rem;        
        border: 1px solid gray;
    }
    #chat-input{
        width: 100%;
        display: flex;
        margin-block: 1rem;
        gap: 2rem;
    }
    #chat-input input{
        flex-grow: 1;
        padding-inline: 1rem;
    }
    #submit-chat-message{
        padding: 6px 14px;
        border: 1px solid gray;
        border-radius: 4px;
    }
</style>