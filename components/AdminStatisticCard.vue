<template>
  <UCard
    :ui="{
      body: 'p-0 sm:px-1 sm:py-4',
    }"
    class="p-6 bg-blue-100"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="text-lg text-gray-500 mb-1"><slot name="title"></slot></p>
        <h3 class="text-2xl font-bold"><slot name="value"></slot></h3>
      </div>
      <slot name="icon"> </slot>
    </div>
  </UCard>
</template>
<script setup lang="ts"></script>
