<script lang="ts" setup>
import { utils, writeFileXLSX } from "xlsx";

const { columnLabels, data, name, data2, columnLabels2 } = defineProps<{
  columnLabels: Record<string, string>;
  data: Record<string, any>[];
  name: string;
  data2?: Record<string, any>[];
  columnLabels2?: Record<string, string>;
}>();
function exportFileTwice() {
  const dataArr = [data, data2];
  const columnLabelsArr = [columnLabels, columnLabels2];

  const wb = utils.book_new();
  dataArr.forEach((data, indexOut) => {
    const headers = Object.keys(columnLabelsArr[indexOut]);
    const labels = Object.values(columnLabelsArr[indexOut]);
    const newData = data.map((row) => {
      const newRow: Record<string, any> = {};
      headers.forEach((key, index) => {
        newRow[labels[index]] = row[key];
      });
      return newRow;
    });
    const ws = utils.json_to_sheet(newData, {
      header: labels,
    });
    utils.book_append_sheet(wb, ws, "Data" + indexOut + 1);
  });
  writeFileXLSX(wb, `${name}.xlsx`);
}
function exportFile() {
  const headers = Object.keys(columnLabels);
  const labels = Object.values(columnLabels);
  const newData = data.map((row) => {
    const newRow: Record<string, any> = {};
    headers.forEach((key, index) => {
      newRow[labels[index]] = row[key];
    });
    return newRow;
  });
  const ws = utils.json_to_sheet(newData, {
    header: labels,
  });
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Data");
  writeFileXLSX(wb, `${name}.xlsx`);
}
</script>
<template>
  <UButton
    variant="outline"
    icon="i-lucide-file"
    size="xl"
    color="info"
    class="ml-auto"
    @click="() => (data2 ? exportFileTwice() : exportFile())"
    >Экспорт</UButton
  >
</template>
