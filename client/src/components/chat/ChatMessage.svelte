<script lang="ts">
    export let user: string;
    export let message: string;
    const dateTime = new Date().toLocaleString();
</script>

<div class="chat-message">
    <span class="user-name">{user}</span>
    <span class="time">{dateTime}</span>
    <p>{message}</p>
</div>

<style>
    .chat-message{
        padding: 1rem;
        padding-bottom: 0;
    }
        .chat-message:not(:first-child){
            border-top: 1px solid gray;
        }
    .user-name{
        font-size: 1.2rem;        
    }
    .time{        
        font-size: 0.8rem;
        color: gray;
        /* wrappar hela span när en del av texten inte får plats */
        display: inline-block;
    }
</style>