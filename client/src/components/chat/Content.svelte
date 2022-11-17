<script>
    import { fade } from "svelte/transition";
</script>

<div id="chat-content" in:fade|local>
    <!-- Inre container för att flytta in scrollbaren en bit. -->
    <div class="scroll-container">
        <slot></slot>
    </div>
</div>

<style>
    #chat-content{
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
</style>