<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { Arrow, Message, UserList } from "./icons";


    export let text: string;
    export let icon: string; // string av SVG, "<svg> </svg>"
    export let iconTooltip: string;
    export let clickIcon: () => void;
</script>

<div class="chat-header">
    <h2 in:fade|local>{text}</h2>

    <button id="toggle-userlist" title={iconTooltip} on:click={clickIcon} >
        <span class="icon" in:fly|local={{ y:-100, opacity:0 }} >{@html icon}</span>
        <span class="arrow">{@html Arrow}</span>                
    </button>

</div>

<style>
    .chat-header{        
        display: flex;
        align-items: start;
        gap: 1rem;
        color: black;
        background-image: linear-gradient(180deg, #dbd9d9, #f0f0f0);
        box-shadow: 0 0 6px black;
        padding-block: 1rem;
        padding-inline: 0.5rem;
    }
    h2{
        font-size: 1.3rem;
        text-align: center;
        margin: auto;
        margin-top: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }
        h2:hover{
            overflow: visible;
            overflow-wrap: anywhere;
        }
    #toggle-userlist{
        display: grid;
        grid-template-columns: 2rem 1.3rem;
        border: 0;
        border-radius: var(--border-radius);
        background: transparent;    
    }
        #toggle-userlist:hover{
            background-color: lightgray;
        }
    #toggle-userlist .icon{
        display: flex; 
        grid-row: 1;
        grid-column: 1;
    }
    #toggle-userlist .arrow{
        display: flex;
        margin-left: -0.2rem;   
    }

</style>