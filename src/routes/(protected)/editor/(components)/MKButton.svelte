<script lang='ts'>
    import { Button } from '$components/ui/button/index.js';
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from '$components/ui/tooltip';


    export let name: string;
    export let onClick: () => void;
</script>


<Tooltip>
    <TooltipTrigger>
        <Button class='w-10 h-10 p-0' on:click={onClick} variant='outline'>
            <slot />
        </Button>
    </TooltipTrigger>
    <TooltipContent>
        {name}
    </TooltipContent>
</Tooltip>

