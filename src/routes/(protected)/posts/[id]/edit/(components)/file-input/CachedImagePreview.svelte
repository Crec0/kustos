<script lang='ts'>

    import { EyeIcon } from 'lucide-svelte';
    import {
        Dialog,
        DialogContent,
        DialogTrigger,
    } from '$components/ui/dialog';
    import { Button } from '$components/ui/button';


    export let blob: File;

    const blobCache = new Map<string, string>();


    async function getOrLoadURL(blob: File): Promise<string> {
        if (blobCache.has(blob.name)) {
            return Promise.resolve(blobCache.get(blob.name)!);
        }
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
                const result = reader.result as string;
                blobCache.set(blob.name, result);
                resolve(result);
            };
        });
    }
</script>


{#await getOrLoadURL(blob) then url}
    <Dialog>
        <DialogTrigger>
            <Button variant='outline'>
                <EyeIcon class='h-6 w-6' />
            </Button>
        </DialogTrigger>
        <DialogContent class='max-w-[40rem]'>
            <img src={url} alt={blob.name} class='rounded p-2 max-h-[40rem]' />
        </DialogContent>
    </Dialog>
{/await}