<script lang="ts">
    import { Yes, No, Write } from "./emojis"
    import { Emojis } from "@server/enums"

    export let selected: Emojis | null;

    
</script>

<div id="emoji-options">
    <button class:active={selected === Emojis.Yes} on:click={() => selected = Emojis.Yes} >{@html Yes}</button>
    <button class:active={selected === Emojis.No}  on:click={() => selected = Emojis.No} >{@html No}</button>
    <button class:active={selected === Emojis.Write}  on:click={() => selected = Emojis.Write} >{@html Write}</button>    
</div>

<style>
    #emoji-options{
        display: flex;
        justify-content: space-evenly;
    }
    button{
        max-height: 100%; max-width: 100%;
        aspect-ratio: 1;
        border: 2px solid black;
        border-radius: 5px;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
    }
    button.active{
        border-color: gold;
    }
</style>