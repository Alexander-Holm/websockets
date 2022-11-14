<header>
    <h1>Websockets chat</h1>
    <span class="border" />
</header>

<style>
    header{
        --animation-speed: 8s;
        --flicker-opacity: 0.3;

        position: relative;

        width: fit-content;
        text-align: center;
        padding: 1.2rem 3rem;

        margin-bottom: 5rem;
        margin-inline: auto;        
    }        
    h1{
        margin: 0;
        font-size: 3rem;
        font-family: clip;
        color: #ffeef1;
        text-shadow: 0 0 12px #ff9cbd;

        animation-name: text-flicker;
        animation-duration: var(--animation-speed);
        animation-timing-function: step-end;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }
        @keyframes text-flicker{
            10% { opacity: var(--flicker-opacity); }
            11% { opacity: 1; }

            35%, 43%, 45%  { opacity: var(--flicker-opacity); }
            40%, 44%, 48% { opacity: 1; }

            70%, 72% { opacity: var(--flicker-opacity); }
            71%, 73% { opacity: 1; }
        }
    .border{
        position: absolute;
        top: 0; left: 0;
        height: 100%; width: 100%;
        box-sizing: border-box;

        border: 3px solid #d8fff9;
        box-shadow: 
            0 0 8px #59e0ff, 
            0 0 8px #59e0ff inset;
        border-radius: 10px;

        animation-name: border-flicker;
        animation-duration: var(--animation-speed);
        animation-timing-function: step-end;
        animation-iteration-count: infinite;
    }
        @keyframes border-flicker{
            60%, 63% { opacity: var(--flicker-opacity); }
            62%, 73% { opacity: 1; }
        }
</style>