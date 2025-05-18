<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Главная",
    url: "/admin/",
    icon: "i-lucide-house",
  },
  {
    title: "Категории",
    url: "/admin/categories",
    icon: "i-lucide-book-heart",
  },
  {
    title: "Доктора",
    url: "/admin/doctors",
    icon: "i-lucide-users",
  },
  {
    title: "Записи",
    url: "/admin/orders",
    icon: "i-lucide-file-text",
  },
  {
    title: "Пользователи",
    url: "/admin/users",
    icon: "i-lucide-users",
  },
];
</script>

<template>
  <Sidebar class="no-print">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel class="py-8">
          <div class="mx-auto border-b">
            <NuxtLink
              href="/"
              class="flex items-center gap-2"
            >
              <img
                class="h-18 w-36 object-cover"
                src="/logo4.png"
                alt="Logo"
              />
            </NuxtLink>
          </div>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="py-14 px-4">
            <SidebarMenuItem
              v-for="item in items"
              :key="item.title"
            >
              <UButton
                :icon="item.icon"
                :to="item.url"
                variant="link"
                size="xl"
                class="text-xl"
              >
                {{ item.title }}</UButton
              >
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
<style>
@media print {
  /* Hide elements not needed for printing */
  .no-print {
    display: none !important;
  }
}
</style>
