<script lang="ts">
    import UserCard from '$components/UserCard.svelte';
    import { page } from '$app/stores';
</script>

<div class="mt-20">
    <UserCard userID={$page.params.id} />
</div>
