<script lang="ts">
    import { Action } from "@server/actions"
    import { Relays } from "@server/relays";
    import NameSelector from './components/NameSelector.svelte';
    import Chat from './components/chat/Chat.svelte';
    import Canvas from './components/canvas/Canvas.svelte';
    import Header from "./components/Header.svelte";
    
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

<Header />
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
    main{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10%;
    }
</style>
