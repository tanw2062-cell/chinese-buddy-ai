<script setup lang="ts">
definePageMeta({ layout: 'practice' })
</script>

<template>
  <div class="flex h-full flex-col gap-4 overflow-y-auto p-4 md:hidden">
    <CompanionStaminaBar />
    <CompanionCharacterList />
  </div>
</template>
