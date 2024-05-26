<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="mx-4 mb-4 flex h-[calc(100vh-8rem)] w-[calc(100vw-4rem)] flex-wrap gap-4">
    {#each $page.data.posts as post (post.id)}
        <div
            class="card bg-surface-100-800-token flex h-max w-full max-w-96 flex-col items-center justify-center rounded md:flex-row"
        >
            <div class="flex flex-col justify-center p-3 md:p-6 md:pl-3">
                <div class="text-4xl font-bold">
                    {post.id}
                </div>
                <div class="text-xl">
                    {post.author}
                </div>
            </div>
        </div>
    {/each}
</div>
