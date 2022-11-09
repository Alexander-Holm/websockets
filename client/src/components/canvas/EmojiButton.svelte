<script lang="ts">
    import { onMount } from "svelte";

    export let active = false;
    export let borderRotation = 0;

    let borderRef: HTMLSpanElement;
    let animation: Animation;
    
    onMount(() => {
        const keyframes = new KeyframeEffect(
            borderRef,
            [ 
                { rotate: `${borderRotation}deg` }, // from
                { rotate: `${borderRotation+360}deg` } // to
            ],
            { duration: 1000, iterations: 1 }
        )        
        animation = new Animation(keyframes);
        // Väntar på animation.finished för att starta animationen,
        // måste därför sätta den manuellt här för att kunna starta animationen första gången.
        animation.finish();
    })

    async function animationStart(){
        // Väntar på att animationen ska bli klar om den redan körs,
        // det blir hackigt annars när man ändrar easing
        await animation.finished;
        // playbackRate ändras av animationEnd
        animation.updatePlaybackRate(1);
        animation.effect.updateTiming({easing: "ease-in"})
        animation.onfinish = animationLoop;
        animation.play();
    }
    function animationLoop(){
        animation.effect.updateTiming({easing: "linear"});
        animation.onfinish = animation.play;
        animation.play();
    }
    async function animationEnd(){
        // Kör klart nuvarande varv med snabbare fart
        animation.updatePlaybackRate(1.5);
        // Kör ett varv till med snabbare fart och easing-out
        await animation.finished;
        animation.effect.updateTiming({easing: "ease-out"});
        animation.onfinish = null;
        animation.play();        
    }
</script>

<button class="emoji-button" class:active on:click
    on:mouseenter={animationStart} on:mouseleave={animationEnd}
>
    <span class="content">
        <slot></slot>
    </span>
    <span bind:this={borderRef} class="border" style={`rotate: ${borderRotation}deg`} />    
</button>

<style>
    .emoji-button{
        position: relative;

        width: 5rem; height: 5rem;
        border: none; border-radius: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        /* För border */
        overflow: hidden;
        background: transparent;
        /* padding = border-width */
        padding: 4px;
    }
        .emoji-button.active{
            box-shadow: 0 0 30px #ff5aff;
        }        
    .content{
        height: 100%; width: 100%;
        background-color: white;
        display: flex;
        align-items: center; justify-content: center;
        padding: 0.5em;
        box-sizing: border-box;
    }
    .border{
        content: "";
        z-index: -1;
        position: absolute;
        top: -25%; left: -25%;
        height: 150%; width: 150%;
        background: linear-gradient(
            135deg, rgb(131, 221, 249) 20%, 
            rgb(135, 80, 255), 
            #e852f4, 
            rgb(254, 216, 255) 80%
        );
    }
</style>