<script lang="ts">
    export let title:string;
    export let active = false;
</script>

<div class="tab" class:active={active}>
    <h2>{title}</h2>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"
        stroke-linecap="square" vector-effect="non-scaling-stroke"
    >
        <path d="m 10 10 h 30 l 3 3 H 90 v 19 l -7 8 H 10 V 10" />
    </svg>
</div>

<style>
    .tab{
        position: relative;
        width: 7rem;
    }
    h2{
        position: absolute;
        top: 50%; left: 50%;
        translate: -50% -50%;

        color: white;
        font-size: 1.1rem;
        margin: 0;
    }
    svg{
        fill: crimson;
        stroke: lightgoldenrodyellow;
        stroke-width: 1px;
    }
</style>