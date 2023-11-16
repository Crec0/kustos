<script lang="ts">
    import { ExternalLink } from 'lucide-svelte';
    import Img from '$lib/assets/icon.png';
</script>

<div class="flex min-h-screen items-center justify-center">
    <section
        class="shadow-primary-400 container mx-auto flex max-w-md flex-col items-center bg-black-700 p-4 shadow sm:p-10 md:mx-0 md:rounded-lg"
    >
        <img alt="Icon" src={Img} width="50%" />
        <h1 class="mb-4 text-center text-4xl font-bold text-white">Kustos</h1>
        <form action="/?/login" class="flex justify-center" method="post">
            <button
                class="text-md m-2 flex content-center items-end gap-2 rounded bg-varden-400 px-6 py-2 text-xl font-semibold text-black hover:ring-2 hover:ring-white focus:ring-2 focus:ring-white active:ring-2 active:ring-white"
                type="submit"
            >
                Login via Discord
                <ExternalLink class="inline" size="32px" />
            </button>
        </form>
    </section>
</div>
