<template>
  <UCard class="bg-gray-100 w-[400px]">
    <article class="space-y-4">
      <div class="w-full">
        <slot name="image"></slot>
      </div>
      <h3 class="text-2xl"><slot name="categoryTitle"></slot></h3>
      <ul class="space-y-3">
        <slot name="servicesList"></slot>
      </ul>
    </article>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </UCard>
</template>
<script setup lang="ts"></script>
