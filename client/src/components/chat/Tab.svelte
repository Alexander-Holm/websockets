<script lang="ts">
    export let title:string;
    export let active = false;
</script>

<button class="tab" class:active={active} on:click>
    <h2 class="tab-title">{title}</h2>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"
        stroke-linecap="square" vector-effect="non-scaling-stroke"
    >
        <clipPath id="clip">
            <use xlink:href="#tab-shape" />
        </clipPath>
        <path id="tab-shape" clip-path="url(#clip)" d="m 0 0 h 30 l 3 3 H 100 v 29 l -7 8 H 0 V 0" />
    </svg>
</button>

<style>
    .tab{
        position: relative;
        width: 6rem;
        display: flex;

        color: var(--border-color);

        fill: darkslategray;
        stroke: var(--border-color);
        stroke-width: calc( var(--border-width) * 2 );

        /* Ta bort button default style */
        border: none; background: transparent;
        padding: 0; margin: 0;
    }
        .tab.active{
            color: rgb(130, 255, 255);
            text-shadow: 0 0 6px rgb(0, 255, 255);

            fill: var(--background-color);
        }
        .tab:hover{
            filter: brightness(1.2);
        }

    .tab-title{
        position: absolute;
        top: 55%; left: 50%;
        translate: -50% -50%;

        font-size: 1rem;
        margin: 0;
    }

</style>