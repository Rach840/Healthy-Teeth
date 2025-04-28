<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { user } = useUserSession();

const { product } = defineProps<{
  product: {
    id: string;
    title: string;
  };
}>();

const df = new DateFormatter("ru-RU", {
  dateStyle: "medium",
});

const isOpen = ref(false);

const today = new Date();
const minDate = new CalendarDate(
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate(),
);
const maxDate = new CalendarDate(
  today.getFullYear(),
  today.getMonth() + 2,
  today.getDate(),
);

const formData = ref<{
  date: CalendarDate | null;
  time: string | null;
}>({
  date: null,
  time: null,
});

const schema = z.object({
  date: z.instanceof(CalendarDate, { message: "Некорректная дата" }),
  time: z.string({ message: "Некорректное время" }),
});

type Schema = z.output<typeof schema>;

const toast = useToast();

const config = useRuntimeConfig();
function onSubmit(event: FormSubmitEvent<Schema>) {
  isOpen.value = false;
  const date = event.data.date.toDate(getLocalTimeZone());
  const time = event.data.time.split(":");
  const parsedTime =
    date.getTime() +
    1000 * 60 * 60 * Number(time[0]) +
    1000 * 60 * Number(time[1]) +
    1000 * 60 * 60 * 3;

  try {
    $fetch(`${config.public.apiUrl}/orders`, {
      method: "POST",
      body: JSON.stringify({
        time: new Date(parsedTime).toISOString(),
        productId: product.id,
      }),
      credentials: "include",
    });
    toast.add({
      title: "Услуга успешно оформлена",
      description: `Вы записаны на ${df.format(
        date,
      )} в ${event.data.time} на услугу "${product.title}"`,
    });
  } catch (error) {
    toast.add({
      title: "Ошибка оформления услуги",
      description: "Попробуйте еще раз позже",
    });
  }
}

function resetForm() {
  formData.value = {
    date: null,
    time: null,
  };
}
</script>

<template>
  <UModal
    @update:open="
      isOpen = $event;
      resetForm();
    "
    v-model:open="isOpen"
    title="Оформление услуги"
  >
    <slot />
    <template #body>
      <UForm
        v-if="user"
        :state="formData"
        :schema="schema"
        class="flex flex-col gap-5"
        @submit="onSubmit($event)"
      >
        <div class="flex flex-col gap-2">
          <UPopover>
            <div class="flex flex-1 shrink-0 flex-col">
              <UButton
                color="neutral"
                class="cursor-pointer"
                variant="ghost"
                icon="i-lucide-calendar"
              >
                {{
                  formData.date
                    ? df.format(formData.date.toDate(getLocalTimeZone()))
                    : "Выберите дату"
                }}
              </UButton>
              <UFormField name="date" />
            </div>

            <template #content>
              <UCalendar
                :year-controls="false"
                :min-value="minDate"
                :max-value="maxDate"
                color="neutral"
                v-model="formData.date as CalendarDate | null"
                class="p-2"
                locale="ru-RU"
                @update:modelValue="
                  formData.date = $event as CalendarDate;
                  formData.time = null;
                "
              />
            </template>
          </UPopover>

          <UPopover v-if="formData.date">
            <div class="flex flex-1 shrink-0 flex-col">
              <UButton
                color="neutral"
                variant="ghost"
                class="cursor-pointer"
                icon="i-lucide-clock"
              >
                {{ formData.time ? formData.time : "Выберите время" }}
              </UButton>
              <UFormField name="time" />
            </div>
            <template #content>
              <TimePicker
                v-model="formData.time"
                name="time"
                :min="
                  formData.date?.toDate(getLocalTimeZone()).getTime() ===
                  minDate.toDate(getLocalTimeZone()).getTime()
                    ? Date.now() - minDate.toDate(getLocalTimeZone()).getTime()
                    : null
                "
              />
            </template>
          </UPopover>
        </div>
        <UButton
          type="submit"
          variant="outline"
          color="neutral"
          class="inline-flex cursor-pointer items-center justify-center"
        >
          Продолжить
        </UButton>
      </UForm>
      <div
        v-else
        class="flex items-center justify-center"
      >
        <p class="text-center text-lg">
          Чтобы записаться на услугу, необходимо
          <NuxtLink
            to="/auth/login"
            class="text-blue-500"
            >войти</NuxtLink
          >
          в аккаунт.
        </p>
      </div>
    </template>
  </UModal>
</template>
