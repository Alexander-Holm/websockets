<script lang="ts">
    export let user: string;
    export let message: string;
    const dateTime = new Date().toLocaleString();
</script>

<div class="chat-message">
    <span class="time">{dateTime}</span>
    <span class="user-name">{user}</span>
    <p class="message">{message}</p>
</div>

<style>
    .chat-message{
        overflow-wrap: break-word;
        padding-block: 1rem;
    }
    span{
        display: block;
    }
    .chat-message:not(:first-child){
        border-top: 1px solid gray;
    }
    .time{        
        font-size: 0.8rem;
        color: gray;
        /* wrappar hela span när en del av texten inte får plats */
        /* display: inline-block; */
    }
    .user-name{
        font-size: 1.2rem;        
        font-weight: bold;
        color: #a47dfb;
        margin-bottom: 0.6rem;
    }
    .message{
        margin: 0;
        color: #89fff4;
    }
</style>