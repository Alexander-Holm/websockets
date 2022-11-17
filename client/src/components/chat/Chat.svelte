<script lang="ts">
    import ChatMessage from "./ChatMessage.svelte";
    import { Action } from "@server/actions";
    import { Relays } from "@server/relays";
    import type { IChatMessage } from "@server/types";
    import { fade, fly, scale } from "svelte/transition";
    import Header from "./Header.svelte";
    import { Enter, Exit, Message, User, UserList } from "./icons";
    import Content from "./Content.svelte";
    import ButtonCyberpunk from "./ButtonCyberpunk.svelte";
    import Tab from "./Tab.svelte";
    
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

<section id="chat">

    <div class="content-box">

    
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

        
            <div class="header">
                <!-- <h2 class="label">Chat</h2> -->
                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" stroke-linecap="square" >
                    <path d="M 10 10 h 30 l 5 5 h 40 v 20 l -10 10 H 10 V 10" />
                </svg> -->
                <Tab title="Chat" />
                <Tab title="Users" />
            </div>
            <div class="scroll-container">
                {#each chatMessages as item}
                    <ChatMessage user={item.username} message={item.message} />
                {/each }
            </div>
            <!-- <Header text={"Chat"} icon={UserList} iconTooltip="Connected users" clickIcon={toggleView} /> -->
            <!-- <Content>
                {#each chatMessages as item}
                    <ChatMessage user={item.username} message={item.message} />
                {/each }
            </Content> -->


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

        <div class="header">
            <h2 class="label">Users</h2>
            <ButtonCyberpunk type="button" on:click={toggleView} >Chat</ButtonCyberpunk>
        </div>
        <div class="scroll-container">
            {#each users as user}
                <span class="username" >
                    {#if user === name}
                        <strong>(You) </strong>
                    {/if}
                    {user}
                </span>
            {/each}
        </div>
    
        <!-- <Header text="Connected users" icon={Message} iconTooltip="Chat" clickIcon={toggleView} />
        
        <div id="connected-users" class="content" in:fade|local>
            {#each users as user}
                <span class="username" >
                    {#if user === name}
                    <strong>(You) </strong>
                    {/if}
                    {user}
                </span>
            {/each}
        </div>   -->
    {/if}

    </div>

    <form class="chat-input" on:submit|preventDefault={sendMessage}>
        <input type="text" placeholder="..." bind:value={chatInput} required  />
        <!-- <button id="submit-chat-message" type="submit" >Send</button> -->
        <ButtonCyberpunk id="submit-chat-message" type="submit" >Send</ButtonCyberpunk>
    </form>

</section>


<style>
    #chat{
        --border-radius: 4px;

        font-family: 'Courier New', Courier, monospace;

        height: 100%;
        flex-basis: 20rem;

        display: flex;
        flex-direction: column;

        position: relative;

    }
    .content-box{
        /* 
            min-height är auto som default och låter inte height vara lägre än height på children.

            flex:1 tillsammans med min-height gör att elementet kan växa i flexbox,
            men inte större än sin tilldelade storlek.

            Det gör att overflow-y går att sätta på children för att få en scrollbar
        */
        min-height: 300px;
        flex: 1;

        background-color: #1d2733;
        position: relative;
        /* Flyttar in scrollbaren en bit */
        padding: 16px;     
        
        border: 1px solid darkred;
    }

    .header{        
        position: absolute;
        bottom: 100%; left: 0;
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 10px;
    }
    .label{
        font-size: 1.1rem;
        text-align: center;
        margin: 0;

        background-color: darkred;
    }

    .scroll-container{        
        overflow-y: auto;
        scrollbar-gutter: stable;
        scrollbar-width: thin;

        padding-inline: 20px;
        display: flex;
        flex-direction: column;

        height: 100%;
        box-sizing: border-box;
    }

    .content{        
        overflow-y: auto;
        scrollbar-width: thin;
        padding: 1rem;
        display: flex;
        flex-direction: column;

        height: 100%;
        box-sizing: border-box;
    }
    #connected-users .username{
        overflow-wrap: anywhere;
        padding-block: 0.5rem;
    } 


    .chat-input{
        display: flex;
        gap: 3px;
        padding: 6px;
        border: none;
    }
    .chat-input input{
        flex-grow: 1;
        padding-inline: 1rem;
        border: none;
        border-radius: inherit;
    }
    #submit-chat-message{
        padding: 8px 14px;
        border: none;
        border-right: 3px solid aqua;
        background-color: #ff2f6a;
        color: white;
        font-size: 1.1rem;      
        clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 80%);  
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