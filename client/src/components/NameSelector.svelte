<script lang="ts">
    export let onSubmit: (name:string) => void;

    function handleSubmit(e){
        const formData = new FormData(e.target);
        const { name } = Object.fromEntries(formData);
        onSubmit(name as string);
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <label for="name" >Enter name</label>
    <input id="name" name="name" type="text" required />

    <button type="submit">Connect</button>
</form>

<style>
    form{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    label{
        font-size: 1.6rem;
    }
    input{
        font-size: 1.3rem;
        text-align: center;

        margin-top: 0.8em;
        margin-bottom: 4em;
        padding: 0.4em;
        width: 30ch;       
        max-width: 90%; 
    }
    button{
        font-size: 1.2rem;
        padding: 0.6em 1em;
        background-color: #46a506;
        color: white;
        border: 2px solid #226a0d;
        border-radius: 4px;
        transition: 
            /* hover */
            100ms background-color, 100ms border-color    
            /* invalid */
            500ms filter,
        ;
    }
        input:invalid + button{
            filter: grayscale(0.8) brightness(1.2);
        }
        input:valid + button:hover{
            background-color: #3e9b00;
            border-color: #004f00;
        }

</style>