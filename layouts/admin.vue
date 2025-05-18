<template>
  <UApp>
    <SidebarProvider>
      <AdminSidebar class="no-print" />
      <main class="w-full">
        <SidebarTrigger />
        <UContainer class="py-6">
          <slot />
        </UContainer>
        <Footer />
      </main>
    </SidebarProvider>
  </UApp>
</template>
<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import AdminSidebar from "~/components/AdminSidebar.vue";
</script>
<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
