<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { CalendarDate, DateFormatter } from "@internationalized/date";

const df = new DateFormatter("ru-RU", {
  dateStyle: "full",
});
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);
const snils = ref([]);
const snilsValidate = computed(() => {
  return snils.value.join("");
});

const modelValue = shallowRef(new CalendarDate(2022, 1, 10));

console.log(modelValue.value);
const show = ref(false);
const schema = z.object({
  firstName: z.string().min(3, "Минимум 3  символа"),
  lastName: z.string().min(4, "Минимум 4  символа"),
  surName: z.string().min(6, "Минимум 6  символов"),
  snils: z.string().min(11, "Заполните все поля"),
  phone: z
    .string()
    .regex(phoneRegex, { message: "Введите корректный номер телефона" }),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8  символов"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  surName: undefined,
  snils: snilsValidate.value,
  phone: undefined,
  modelValue: undefined,
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>
<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <div class="grid grid-cols-2 gap-6">
      <UFormField
        class="col-span-1"
        required
        label="Имя"
        size="xl"
        name="firstName"
      >
        <UInput placeholder="Иван" class="w-full" v-model="state.firstName" />
      </UFormField>

      <UFormField
        class="col-span-1"
        required
        size="xl"
        label="Фамилия"
        name="lastName"
      >
        <UInput
          placeholder="Иванов"
          class="w-full"
          v-model="state.lastName"
          type="text"
        />
      </UFormField>
      <UFormField
        class="col-span-1"
        label="Отчество"
        size="xl"
        hint="Опционально"
        name="surName"
      >
        <UInput placeholder="Иванович" class="w-full" v-model="state.surName" />
      </UFormField>

      <UFormField
        class="col-span-1"
        required
        size="xl"
        label="Снилс"
        name="lastName"
      >
        <UPinInput v-model="snils" type="number" length="11" class="w-full" />
      </UFormField>
      <UFormField
        class="col-span-1"
        required
        label="Номер телефона"
        size="xl"
        name="phone"
      >
        <UInput
          icon="i-lucide-phone"
          placeholder="89671234806"
          class="w-full"
          v-model="state.phone"
        />
      </UFormField>
      <UFormField
        class="col-span-1"
        required
        label="Электронная почта"
        size="xl"
        name="email"
      >
        <UInput
          icon="i-lucide-at-sign"
          placeholder="john@lennon.com"
          class="w-full"
          v-model="state.email"
        />
      </UFormField>
      <UFormField
        class="col-span-1"
        required
        label="Дата рождения"
        size="xl"
        name="email"
      >
        <UPopover>
          <UButton
            class="w-full"
            color="neutral"
            variant="subtle"
            icon="i-lucide-calendar"
          >
            {{
              state.modelValue
                ? df.format(state.modelValue.toDate(getLocalTimeZone()))
                : "Выберите дату"
            }}
          </UButton>

          <template #content>
            <UCalendar v-model="state.modelValue" class="p-2" />
          </template>
        </UPopover>
      </UFormField>
      <UFormField
        class="col-span-1"
        required
        size="xl"
        label="Пароль"
        name="password"
      >
        <UInput
          :type="show ? 'text' : 'password'"
          :ui="{ trailing: 'pe-1' }"
          class="w-full"
          v-model="state.password"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="xl"
              :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="show ? 'Hide password' : 'Show password'"
              :aria-pressed="show"
              aria-controls="password"
              @click="show = !show"
            /> </template
        ></UInput>
      </UFormField>
    </div>
    <UButton size="xl" type="submit"> Зарегистрироваться </UButton>
  </UForm>
</template>
