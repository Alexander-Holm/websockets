<script lang="ts">
    import { Yes, No, Write } from "./emojis"
    import { Emojis } from "@server/enums"

    export let selected: Emojis | null;

    function click(emoji: Emojis){
        if(emoji === selected){
            selected = null;
            return;
        }
        selected = emoji;
    }

    
</script>

<div id="emoji-options">
    <h3>Send an emoji on the canvas</h3>
    <div class="buttons">
        <button class:active={selected === Emojis.Yes} on:click={() => click(Emojis.Yes)} >{@html Yes}</button>
        <button class:active={selected === Emojis.No}  on:click={() => click(Emojis.No)} >{@html No}</button>
        <button class:active={selected === Emojis.Write}  on:click={() => click(Emojis.Write)} >{@html Write}</button> 
    </div>
</div>

<style>
    #emoji-options{
        display: flex;
        flex-direction: column;
        align-items: center;
        
    }
    h3{
        margin: 0;
    }
    .buttons{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3rem;
    }
    button{
        width: 4.5rem; height: 4.5rem;
        border: 2px solid gray;
        border-radius: 5px;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
    }
    button.active{
        border-color: var(--blue);
    }
</style>