<script lang="ts">
    import Chat from './components/Chat.svelte';
    import NameSelector from './components/NameSelector.svelte';
    import { Action } from "@server/actions"
    
    const SERVICE_URL = process.env.SERVICE_URL;
    let isConnected = false;
    let websocket: WebSocket;

    function nameSelectionHandler(name: string){
        websocket = new WebSocket(SERVICE_URL);
        websocket.onopen = (e) => {
            websocket.send(Action.Connect(name))
            isConnected = true;
        }
    }
</script>

<header>
    <h1>Websocket chat test</h1>
</header>
<main>
    {#if isConnected}
        <Chat socket={websocket} />
    {:else}
        <NameSelector onSubmit={nameSelectionHandler} />
    {/if}
</main>

<style>
    header{
        text-align: center;
    }
    main{
        /* Måste ha overflow:hidden för att kunna ha scrollbar på chatten */
        overflow: hidden;
    }
</style>
