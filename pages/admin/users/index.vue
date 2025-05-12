<script setup lang="ts">
import type { User } from "~/lib/types";
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";
import { upperFirst } from "scule";
import { exportFile } from "~/lib/export-table";

definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});
const table = useTemplateRef("table");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const config = useRuntimeConfig();
const { token, isAuthenticated } = useAuthStore();
const users = ref<User[] | null>(null);
const loading = ref(true);
watchEffect(async () => {
  if (isAuthenticated) {
    const { data: usersResp, status } = await useFetch(
      `${config.public.apiUrl}/admin/users`,
      {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      },
    );
    console.log(usersResp.value, status);
    users.value = usersResp.value;
    loading.value = false;
  }
});
const columnLabels: Record<string, string> = {
  id: "ID",
  firstName: "Имя",
  lastName: "Фамилия",
  surName: "Отчество",
  email: "Почта",
  phone: "Номер телефона",
  snils: "Снилс",
  gender: "Пол",
  birth: "День рождения",
};
const columns: TableColumn<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => getHeader(column, "ID"),
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => getHeader(column, "Имя"),
    cell: ({ row }) => row.getValue("firstName"),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => getHeader(column, "Фамилия"),
    cell: ({ row }) => row.getValue("lastName"),
  },
  {
    accessorKey: "surName",
    header: ({ column }) => getHeader(column, "Отчество"),
    cell: ({ row }) =>
      row.getValue("surName") ? row.getValue("surName") : "Отсутствует",
  },
  {
    accessorKey: "email",
    header: ({ column }) => getHeader(column, "Почта"),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => getHeader(column, "Номер телефона"),
  },
  {
    accessorKey: "snils",
    header: ({ column }) => getHeader(column, "Снилс"),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => getHeader(column, "Пол"),
    cell: ({ row }) =>
      row.getValue("gender") == "MALE"
        ? "Мужской"
        : row.getValue("gender") == "FEMALE"
          ? "Женский"
          : "Не найдено",
  },
  {
    accessorKey: "birth",
    header: ({ column }) => getHeader(column, "День рождения"),
    cell: ({ row }) => {
      return new Date(row.getValue("birth")).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour12: false,
      });
    },
  },
];

function getHeader(column: Column<User>, label: string) {
  const isSorted = column.getIsSorted();

  return h(
    UDropdownMenu,
    {
      content: {
        align: "start",
      },
      "aria-label": "Actions dropdown",
      items: [
        {
          label: "По возрастанию",
          type: "checkbox",
          icon: "i-lucide-arrow-up-narrow-wide",
          checked: isSorted === "asc",
          onSelect: () => {
            if (isSorted === "asc") {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          },
        },
        {
          label: "По убыванию",
          icon: "i-lucide-arrow-down-wide-narrow",
          type: "checkbox",
          checked: isSorted === "desc",
          onSelect: () => {
            if (isSorted === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(true);
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        label,
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 data-[state=open]:bg-elevated",
        "aria-label": `Sort by ${isSorted === "asc" ? "descending" : "ascending"}`,
      }),
  );
}

const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
</script>

<template>
  <div class="flex-1 container mx-auto divide-y divide-accented w-full">
    <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput
        :model-value="
          table?.tableApi?.getColumn('email')?.getFilterValue() as string
        "
        class="max-w-sm min-w-[12ch]"
        size="xl"
        placeholder="Фильтры..."
        @update:model-value="
          table?.tableApi?.getColumn('email')?.setFilterValue($event)
        "
      />
      <UButton
        variant="outline"
        icon="i-lucide-file"
        size="xl"
        color="info"
        class="ml-auto"
        @click="() => exportFile(users, 'Пользователи')"
        >Экспорт</UButton
      >
      <UDropdownMenu
        :items="
          table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: columnLabels[column.id] ?? upperFirst(column.id),
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
            }))
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
    </div>
    <UTable
      v-model:sorting="sorting"
      :data="users"
      ref="table"
      sticky
      :loading="loading"
      loading-color="info"
      loading-animation="carousel"
      :columns="columns"
      class=""
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
    </UTable>
  </div>
</template>
