<script setup lang="ts">
const { stamina, staminaMax } = useCompanion()
const percent = computed(() => Math.round((stamina.value / staminaMax) * 100))
</script>

<template>
  <section class="glass-panel rounded-2xl p-4">
    <div class="mb-2 flex items-center justify-between text-xs">
      <p class="font-medium tracking-wide text-slate-300">Practice credits</p>
      <p class="text-fuchsia-200">{{ stamina }} / {{ staminaMax }}</p>
    </div>
    <UProgress :value="percent" color="fuchsia" size="sm" />
    <p class="mt-2 text-[11px] leading-5 text-slate-400">
      Each turn uses a little credit so sessions stay focused. Premium unlocks unlimited practice.
    </p>
  </section>
</template>
