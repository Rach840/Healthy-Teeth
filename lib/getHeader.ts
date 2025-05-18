import type { SortDirection } from "@tanstack/vue-table";

export const getHeaderDropDownProps = (
  isSorted: false | SortDirection,
  column: Column,
) => {
  return {
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
  };
};
export const getHeaderButtonProps = (
  isSorted: false | SortDirection,
  label: string,
) => {
  return {
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
  };
};
export const sorting = ref([
  {
    id: "id",
    desc: false,
  },
]);
