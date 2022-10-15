<script lang="ts">
    import Chat from './components/Chat.svelte';
    import NameSelector from './components/NameSelector.svelte';
    import { Actions } from "../../server/distribution/enums";


    let isConnected = false;
    let websocket: WebSocket;

    function nameSelectionHandler(name: string){
        websocket = new WebSocket("ws://localhost:5050");        
        websocket.onopen = (e) => {
            const data = { action: Actions.Connect, data: name};
            const json = JSON.stringify(data);
            websocket.send(json)
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
