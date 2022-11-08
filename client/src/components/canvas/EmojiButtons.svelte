<script lang="ts">
    import { Yes, No, Write } from "./emojis"
    import { Emojis } from "@server/enums"
    import EmojiButton from "./EmojiButton.svelte";

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
    <h3>Send an emoji on the screen</h3>
    <div class="buttons">
        <button class="emoji-button" class:active={selected === Emojis.Yes} on:click={() => click(Emojis.Yes)} >{@html Yes}</button>
        <button class="emoji-button" class:active={selected === Emojis.No}  on:click={() => click(Emojis.No)} >{@html No}</button>
        <button class="emoji-button" class:active={selected === Emojis.Write}  on:click={() => click(Emojis.Write)} >{@html Write}</button> 
        <EmojiButton active={selected === Emojis.Yes} on:click={() => click(Emojis.Yes)} >{@html Yes}</EmojiButton>
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
    .emoji-button{
        position: relative;

        width: 4.5rem; height: 4.5rem;
        border: none; border-radius: 0;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;        
    }
        .emoji-button::after{
            content: "";
            z-index: -1;
            position: absolute;
            top: -25%; left: -25%;
            height: 150%; width: 150%;
            scale: 0.75;
            background: linear-gradient(135deg, rgb(131, 221, 249), rgb(135, 80, 255), #e852f4, rgb(254, 216, 255));
        }
            @keyframes rotate{
                to{rotate: 360deg;}
            }
        .emoji-button.active{
            border-color: var(--blue);
        }
        .emoji-button:hover::after{
            animation: 1s rotate infinite;
        }
</style>