<script lang="ts">
    import type { PageData } from './$types';
    import { Avatar } from '@skeletonlabs/skeleton';

    export let data: PageData;

    function relative(date: string): string {
        const numeric = parseInt(date);
        const diff = Date.now() - numeric;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        console.log(Date.now(), numeric, diff, seconds, minutes, hours, days, months, years);

        return [
            years > 0 ? `${years} Years` : '',
            months % 12 > 0 ? `${months % 12} Months` : '',
            days % 365 > 0 ? `${days % 365} days` : '',
        ].join(' ');
    }

    function absolute(creation: string) {
        const numeric = parseInt(creation);
        const date = new Date(numeric);
        return date.toUTCString();
    }
</script>

<div
    class="variant-filled-primary card h-max flex mt-20 flex-col justify-center items-center md:flex-row md:items-center"
>
    <div class="p-3 md:p-6 md:pr-3 pb-0 md:pb-6">
        <Avatar class="w-32 rounded-xl" src={data.avatarUrl} />
    </div>
    <div class="p-3 md:p-6 md:pl-3 flex flex-col justify-center">
        <div class="text-4xl font-bold">
            {data.displayName}
        </div>
        <div class="text-xl">
            @{data.username}
        </div>
        <div class="pt-6">
            <span class="font-bold"> ID </span>
            {data.id}
        </div>
        <div class="w-max">
            <span class="font-bold"> Since </span>
            {absolute(data.creation)}
        </div>
        <div class="w-max">
            <span class="font-bold"> Age </span>
            {relative(data.creation)}
        </div>
    </div>
</div>
