<script setup lang="ts">
const { min } = defineProps<{
  name: string;
  min: number | null;
}>();

const time = defineModel<string | null>();

const h = computed(() => Math.floor((min ?? 0) / 3600 / 1000));
const m = computed(() => Math.floor(((min ?? 0) / 60 / 1000) % 60));
</script>

<template>
  <div class="flex h-32 gap-1.5 overflow-hidden rounded-md bg-[#2b7fff]">
    <div class="no-sidebar flex flex-col overflow-y-auto">
      <input
        type="time"
        hidden
        v-model="time"
        required
        :name="name"
      />
      <UButton
        color="neutral"
        variant="ghost"
        class="inline-flex h-8 w-12 items-center justify-center rounded-none text-white hover:bg-[#80b2ff]"
        :class="
          time?.split(':')[0] === String(hour) ? 'bg-[#0166ff]' : 'bg-[#2b7fff]'
        "
        v-for="hour in Array.from({ length: 12 }, (_, i) =>
          i + 9 === 9 ? '09' : i + 9,
        )"
        :key="hour"
        :disabled="Number(hour) <= h"
        @click="
          () => {
            const help = time?.split(':');
            time = `${hour}:${help?.[1] ?? '00'}`;
          }
        "
      >
        {{ hour }}
      </UButton>
    </div>
    <div class="flex items-center text-2xl text-white">:</div>
    <div class="no-sidebar flex flex-col overflow-y-auto">
      <UButton
        color="neutral"
        variant="ghost"
        class="inline-flex h-8 w-12 items-center justify-center rounded-none text-white hover:bg-[#80b2ff]"
        :class="
          time?.split(':')[1] === String(minute)
            ? 'bg-[0166ff]'
            : 'bg-[#2b7fff]'
        "
        v-for="minute in Array.from({ length: 4 }, (_, i) =>
          i === 0 ? '00' : `${i * 15}`,
        )"
        :key="minute"
        :disabled="
          time?.split(':')[0] === undefined ||
          (h === Number(time?.split(':')[0]) && Number(minute) <= m)
        "
        @click="
          () => {
            const help = time?.split(':');
            time = `${help?.[0] ?? '09'}:${minute}`;
          }
        "
      >
        {{ minute }}
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.no-sidebar {
  scrollbar-width: none;
}
</style>
