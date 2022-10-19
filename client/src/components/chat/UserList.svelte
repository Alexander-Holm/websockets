<script lang="ts">
    import { UserList } from "./icons";


    export let usernames:string[] = [];

    let isOpen = false;

</script>

<div id="connected-users">
    <button on:click={() => isOpen = !isOpen}>{@html UserList}</button>

    {#if isOpen}
    <div class="list">
        <h2>Users</h2>

        {#each usernames as user}
            <span>{user}</span>
        {/each}
    </div>
    {/if}
</div>

<style>
    #connected-users{
        position: absolute;
        top: 0; right: 0;

        border: 1px solid black;
    }
    .list{
        width: 100%;
    }
</style>