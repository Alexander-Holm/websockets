<script lang="ts">
    export let active = false;

    let borderRef: HTMLSpanElement;
    const animation = {
        active: false,
        ending: false,
    }

    function startAnimation(){
        borderRef.onanimationiteration = null;
        animation.active = true;
        animation.ending = false;
    }
    function completeAnimation(){
        borderRef.onanimationiteration = () => {
            console.log("hej")
            animation.ending = true;
            endAnimation();
        }
    }
    function endAnimation(){        
        borderRef.onanimationend = () =>{
            animation.active = false;
            animation.ending = false;
            borderRef.onanimationiteration = null;
        }
    }
</script>

<button class="emoji-button" class:active on:click
    on:mouseenter={startAnimation} on:mouseleave={completeAnimation}
>
    <span class="content">
        <slot></slot>
    </span>
    <span bind:this={borderRef} class="border" class:animated={animation.active} class:ending={animation.ending} />    
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
        
        transition: 200ms;
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

    @keyframes rotate{
        from{rotate: 0deg}
        to{rotate: 360deg;}
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
        .border.animated{
            animation: 1s rotate linear infinite;
        }
            
            .border.animated.ending{
                animation: 5s rotate ease-out;
            }
        

</style>