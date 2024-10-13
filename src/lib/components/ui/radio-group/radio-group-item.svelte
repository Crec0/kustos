<script lang='ts'>
    import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
    import { cn } from '$lib/utils/svelte.js';


    type $$Props = RadioGroupPrimitive.ItemProps & {
        value: string;
    };
    type $$Events = RadioGroupPrimitive.ItemEvents;

    let className: $$Props['class'] = undefined;
    export let value: $$Props['value'];
    export { className as class };
</script>

<RadioGroupPrimitive.Item
    {...$$restProps}
    class={cn(
		"text-primary h-5 w-5 border rounded-full shadow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
    on:click
    {value}
>
    <div class='flex items-center justify-center translate-y-[-0.200rem]'>
        <RadioGroupPrimitive.ItemIndicator class='flex items-center'>
            <svg class='lucide lucide-circle-dot' fill='none' height='24' stroke='currentColor' stroke-linecap='round'
                 stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24'
                 xmlns='http://www.w3.org/2000/svg'>
                <circle cx='12' cy='12' r='10' />
                <circle class='fill-primary' cx='12' cy='12' r='4' />
            </svg>
        </RadioGroupPrimitive.ItemIndicator>
    </div>
</RadioGroupPrimitive.Item>
