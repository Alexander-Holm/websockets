<script lang="ts">
    import ChatMessage from "./ChatMessage.svelte";
    import { Actions, MessageTypes } from "../../../server/distribution/enums";

    export let socket: WebSocket;

    let chatMessages = [];
    let chatInput = "";

    socket.onmessage = message => {
        const { type, data } = JSON.parse(message.data);
        switch(type){
            case MessageTypes.ChatMessage: 
                // Kan inte använda array.push(), Svelte känner inte av ändringar av .push()
                chatMessages = [...chatMessages, data];
                break;
        }
    }

    function sendMessage(){
        const data = { action: Actions.ChatMessage, data: chatInput};
        const json = JSON.stringify(data);
        socket.send(json);
        chatInput = "";
    }
</script>

<section id="chat-container">
    <div id="chat-messages">
        {#each chatMessages as message}
            <ChatMessage user="TestUser" message={message} />
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