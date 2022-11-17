<script lang="ts">
    export let type = "button";
    export let id:string = null;
</script>

<button {id} {type} class="cyberpunk-button" on:click >
    <slot></slot>
</button>

<style>
    .cyberpunk-button{
        padding: 8px 14px;
        border: none;
        border-right: 3px solid aqua;
        background-color: #ff2f6a;
        color: white;
        font-size: 1.1rem;      
        clip-path: polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 80%);  
    }
        .cyberpunk-button:hover {
            filter: brightness(1.1);
        }
        .cyberpunk-button:active {
            box-shadow: 0 0 4px black inset;
        }
</style>