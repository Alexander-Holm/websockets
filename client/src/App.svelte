<script lang="ts">
    import { Action } from "@server/actions"
    import Chat from './components/chat/Chat.svelte';
    import NameSelector from './components/NameSelector.svelte';
    import Canvas from './components/canvas/Canvas.svelte';
    import { Relays } from "@server/relays";
    
    const SERVICE_URL = process.env.SERVICE_URL;
    let isConnected: boolean | null = false;
    let websocket: WebSocket;
    let name:string;

    function nameSelectionHandler(inputName: string){
        isConnected = null;
        websocket = new WebSocket(SERVICE_URL);
        websocket.addEventListener("message", onConnectHandler);
        websocket.onopen = () => websocket.send(Action.Connect(inputName));

        function onConnectHandler(websocketMessage: MessageEvent<any>){
            const { type, data } = JSON.parse(websocketMessage.data);
            if(type !== Relays.OnConnect) return;
            name = data;
            isConnected = true;
        }
    }
</script>

<header>
    <h1>Websocket chat test</h1>
</header>
<main>
    {#if isConnected === false}
        <NameSelector onSubmit={nameSelectionHandler} />        
    {/if}
    {#if isConnected === null}
        <p>Loading...</p>
        <p>If the server is is inactive this may take up to 30 seconds</p>
    {/if}
    {#if isConnected}
        <Canvas socket={websocket} />
        <Chat socket={websocket} name={name} />        
    {/if}
</main>

<style>
    header{
        text-align: center;
    }
    main{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;

        /* 
            För att canvas height sätts med javascript vid fönster-resize.
            Annars blir canvas högre när man gör fönstret bredare
            och man får till slut en scrollbar.
         */
        height: 100%;
        overflow-y: hidden;
        /* padding för att inte gömma outlines med overflow:hidden */
        padding: 10px;
    }
</style>
