<script lang="ts">
    import { onMount } from "svelte";
    import { sineIn, cubicOut } from "svelte/easing"

    export let active = false;
    export let borderRotation = 0;

    let borderRef: HTMLSpanElement;
    let animation: Animation;
    // Används för att kunna avbryta en transition och påbörja en ny.
    // t.ex: mouseLeave -> mouseEnter , innan mouseLeave transition är klar
    let transitionId: number;
    
    onMount(() => {
        // Skapa animationen för border
        const keyframes = new KeyframeEffect(
            borderRef,
            [ 
                { rotate: `${borderRotation}deg` }, // from
                { rotate: `${borderRotation+360}deg` } // to
            ],
            { duration: 10000, iterations: Infinity }
        )        
        animation = new Animation(keyframes);
        animation.play();
    })

    // from: animation.playbackRate
    // för att byta mjukt mellan transitions
    function increaseSpeed(){
        transitionId = speedTransition({
            from: animation.playbackRate,
            to: 10,
            duration: 50,
            easing: sineIn
        });
    }
    function decreaseSpeed(){
        transitionId = speedTransition({
            from: animation.playbackRate,
            to: 1,
            duration: 1000,
            easing: cubicOut
        })
    }

    type transitionConfig = {
        from: number,
        to: number,
        duration: number, //ms
        easing: (progress: number) => number,
    }
    function speedTransition(transition: transitionConfig , startTime = Date.now()){        
        requestAnimationFrame(() => {
            if(transitionId !== startTime) return;

            const elapsedTime = Date.now() - startTime;
            // progress måste vara mellan 0 och 1
            const progress = Math.min( elapsedTime / transition.duration, 1 );
            const transitionSpan = transition.to - transition.from;
            const easingModifier = transition.easing(progress);
            const easedValue =  (transitionSpan * easingModifier) + transition.from;
            animation.updatePlaybackRate(easedValue);

            if(progress < 1)
                speedTransition(transition, startTime);
        })
        // Returnerar startTime som ett unikt id.
        return startTime;
    }    
</script>

<button class="emoji-button" class:active on:click
    on:mouseenter={increaseSpeed} on:mouseleave={decreaseSpeed}
    on:focus={increaseSpeed} on:blur={decreaseSpeed}
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