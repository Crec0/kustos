<script lang="ts">
    import UserCard from '$components/custom/ui/UserCard.svelte';
    import { page } from '$app/stores';
</script>

<div class="mt-20">
    <UserCard userID={$page.params.id} />
</div>
