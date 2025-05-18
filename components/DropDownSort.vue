<script setup lang="ts">
const { table, columnLabels } = defineProps(["table", "columnLabels"]);
</script>

<template>
  <UDropdownMenu
    :items="
      table?.tableApi
        ?.getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => {
          return {
            label: columnLabels[column.id],
            type: 'checkbox' as const,
            checked: column.getIsVisible(),
            onUpdateChecked(checked: boolean) {
              table?.tableApi
                ?.getColumn(column.id)
                ?.toggleVisibility(!!checked);
            },
            onSelect(e?: Event) {
              e?.preventDefault();
            },
          };
        })
    "
    :content="{ align: 'end' }"
  >
    <UButton
      label="Колонки"
      color="neutral"
      size="xl"
      variant="outline"
      trailing-icon="i-lucide-chevron-down"
      class="ml-auto"
      aria-label="Columns select dropdown"
    />
  </UDropdownMenu>
</template>
