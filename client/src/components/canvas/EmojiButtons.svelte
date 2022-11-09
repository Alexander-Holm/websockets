<script lang="ts">
    import { ICONS } from "./icons"
    import type { Emojis } from "@server/enums"
    import EmojiButton from "./EmojiButton.svelte";

    export let selected: Emojis | null;

    function click(emoji){
        if(emoji === selected){
            selected = null;
            return;
        }
        selected = emoji;
    }    
</script>

<div id="emoji-options">
    <h3>Send an emoji on the screen</h3>
    <div class="buttons">
        {#each Object.entries(ICONS) as [name, svg], index}
            <EmojiButton active={selected === name} borderRotation={index * 90} on:click={() => click(name)} >{@html svg}</EmojiButton>
        {/each}
    </div>
</div>

<style>
    #emoji-options{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    h3{
        font-size: 2.5rem;
        font-family: dash;

        color: transparent;
        background: linear-gradient( rgb(131, 221, 249) 20%, rgb(135, 80, 255) 60%, #e852f4 60%, rgb(254, 216, 255) 80% );
        background-clip: text;
        filter: drop-shadow(3px 5px #0f0037);

        /* gradient blir fel om texten är mer än en rad */
        white-space: nowrap;

    }
    .buttons{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3rem;
    }
</style>