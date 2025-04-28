<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { toDate } from "reka-ui/date";
import { Calendar } from "~/components/ui/calendar";

const toast = useToast();

// Проброска переменных с родительского элемента
const { updateOpen } = inject("openPasswordEdit");
const { edited } = inject("editForm");
const { user } = inject("user");

const schema = z.object({
  email: z.string().email("Invalid email"),
  surName: z
    .string()
    .min(6, "Минимум 6  символов")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, {
      message: "Введите корректный номер телефона",
    }),
  snils: z
    .string()
    .regex(/^\d+$/, { message: "Только цифры разрешены" })
    .min(10, "Введите корректный снилс"),
  birth: z.date(),
});

// DataPicker

const dateMessage = ref(user?.value?.birth.split("T")[0]);
const df = new DateFormatter("ru-RU", {
  dateStyle: "long",
});
const value = computed({
  get: () => (dateMessage.value ? parseDate(dateMessage.value) : undefined),
  set: (val) => val,
});

//
type Schema = z.output<typeof schema>;
const placeholder = ref();
const state = reactive<Partial<Schema>>({
  surName: user?.value?.surName,
  email: user?.value?.email,
  phone: user?.value?.phone,
  snils: user?.value?.snils,
  birth: new Date(Date.parse(user?.value?.birth)),
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  const resp: { succes: boolean; message?: string } = await $fetch(
    "/api/users/updateUserInfo",
    {
      method: "patch",
      body: {
        newInfo: { ...event.data },
      },
    },
  );
  if (resp.succes) {
    toast.add({
      title: "Ваши данные успешные изменены.",
    });
  }
}
</script>
<template>
  <UForm
    :state="state"
    :schema="schema"
    @submit="onSubmit"
    class="space-y-4"
  >
    <div class="grid grid-cols-3 gap-4">
      <UFormField
        size="xl"
        label="Имя"
        name="firstName"
        class="col-span-1"
      >
        <UInput
          :disabled="true"
          class="w-full"
          :ui="{
            base: 'disabled:opacity-100',
          }"
        >
          <template #leading>
            {{ user?.firstName }}
          </template>
        </UInput>
      </UFormField>
      <UFormField
        size="xl"
        label="Фамилия"
        name="lastName"
        class="col-span-1"
      >
        <UInput
          size="xl"
          class="w-full"
          :disabled="true"
          :ui="{
            base: 'disabled:opacity-100',
          }"
        >
          <template #leading>
            {{ user?.lastName }}
          </template>
        </UInput>
      </UFormField>

      <UFormField
        size="xl"
        label="Отчество"
        name="surName"
        class="col-span-1"
      >
        <UInput
          v-model="state.surName"
          :ui="{
            base: 'disabled:ring-default ring-primary disabled:opacity-100',
          }"
          :disabled="!edited"
          class="w-full !disabled:ring-default ring-primary disabled:opacity-100"
        />
      </UFormField>
      <UFormField
        size="xl"
        label="Электронная почта"
        name="email"
        class="col-span-1"
      >
        <UInput
          v-model="state.email"
          :disabled="!edited"
          :ui="{
            base: 'disabled:ring-default ring-primary disabled:opacity-100',
          }"
          class="w-full disabled:ring-default ring-primary disabled:opacity-100"
        />
      </UFormField>
      <UFormField
        label="Номер телефона"
        name="phone"
        size="xl"
        class="col-span-1"
      >
        <UInput
          v-model="state.phone"
          :disabled="!edited"
          :maxlength="11"
          type="text"
          class="w-full"
          :ui="{
            base: 'disabled:ring-default ring-primary disabled:opacity-100',
          }"
          :defaultValue="user?.phone"
        />
      </UFormField>
      <UFormField
        size="xl"
        label="Снилс"
        name="snils"
        class="col-span-1"
      >
        <UInput
          v-model="state.snils"
          :disabled="!edited"
          :maxlength="11"
          type="text"
          :ui="{
            base: ' disabled:ring-default ring-primary disabled:opacity-100',
          }"
          class="w-full"
          :defaultValue="user?.snils"
        />
      </UFormField>
      <UFormField
        class="col-span-1"
        required
        label="Дата рождения"
        size="xl"
        name="birth"
      >
        <UPopover>
          <UButton
            color="neutral"
            class="w-full"
            size="xl"
            variant="outline"
            :ui="{
              base: 'disabled:opacity-100 disabled:ring-default ring-primary ',
            }"
            :disabled="!edited"
            icon="i-lucide-calendar"
          >
            {{ value ? df.format(toDate(value)) : "Выберите дату" }}
          </UButton>
          <template #content>
            <Calendar
              v-model:placeholder="placeholder"
              v-model="value"
              :disabled="!edited"
              calendar-label="Дата рождения"
              initial-focus
              :min-value="new CalendarDate(1900, 1, 1)"
              :max-value="today(getLocalTimeZone())"
              @update:model-value="
                (v) => {
                  if (v) {
                    dateMessage = v.toString();
                    state.birth = toDate(v);
                    console.log(dateMessage, v);
                  } else {
                    state.birth = undefined;
                  }
                }
              "
            />
          </template>
        </UPopover>
      </UFormField>
    </div>
    <div class="flex items-center justify-between">
      <UButton
        label="Сохранить изменения "
        v-if="edited"
        type="submit"
        size="xl"
        variant="soft"
        class="self-end"
      />
      <UButton
        label="Изменить пароль"
        size="xl"
        v-if="edited"
        variant="soft"
        class="self-end"
        @click="updateOpen"
      />
    </div>
  </UForm>
</template>
