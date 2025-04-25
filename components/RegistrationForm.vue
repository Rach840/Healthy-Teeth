<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { PinInput, PinInputGroup } from "@/components/ui/pin-input";
import { PinInputInput } from "reka-ui";
import { PinInputSeparator } from "~/components/ui/pin-input";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { Calendar } from "~/components/ui/calendar";
import { toDate } from "reka-ui/date";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);
const genders = [
  {
    label: "Женский",
    value: "FEMALE",
  },
  {
    label: "Мужской",
    value: "MALE",
  },
];
const value = computed({
  get: () => (state.birth ? parseDate(state.birth) : undefined),
  set: (val) => val,
});
const snils = ref<string[]>([]);
const snilsComp = () => {
  state.snils = snils.value.join("");
};
const errorMessage = ref<string>("");
const df = new DateFormatter("ru-RU", {
  dateStyle: "long",
});
const show = ref(false);
const schema = z.object({
  firstName: z.string().min(3, "Минимум 3  символа"),
  lastName: z.string().min(4, "Минимум 4  символа"),
  surName: z.string().min(6, "Минимум 6  символов"),
  snils: z.string().min(10, "Заполните все поля"),
  birth: z
    .string()
    .refine((v) => v, { message: "A date of birth is required." }),
  phone: z
    .string()
    .regex(phoneRegex, { message: "Введите корректный номер телефона" }),
  email: z.string().email("Введите корректный email"),
  gender: z.string(),
  password: z.string().min(8, "Минимум 8  символов"),
});

type Schema = z.output<typeof schema>;
const placeholder = ref();
const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  surName: undefined,
  snils: undefined,
  phone: undefined,
  birth: undefined,
  gender: undefined,
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const resp: { succes: boolean; message: string } = await $fetch(
    "/api/users/create",
    {
      method: "post",
      body: { user: event.data },
    },
  );
  if (resp.message) {
    errorMessage.value = true;
  }
}
</script>
<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UAlert
      v-if="errorMessage"
      color="error"
      :title="errorMessage"
      class="w-full"
      description="Поменяйте электронную почту или войдите"
      icon="i-lucide-terminal"
    />
    <div class="grid grid-cols-2 gap-6">
      <UFormField
        class="col-span-1"
        required
        label="Имя"
        size="xl"
        name="firstName"
      >
        <UInput
          placeholder="Иван"
          class="w-full"
          v-model="state.firstName"
        />
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
        <UInput
          placeholder="Иванович"
          class="w-full"
          v-model="state.surName"
        />
      </UFormField>

      <UFormField
        class="col-span-1"
        required
        size="xl"
        label="Снилс"
        name="lastName"
      >
        <PinInput
          id="pin-input"
          v-model="snils"
          @complete="snilsComp"
        >
          <PinInputGroup class="gap-1">
            <template
              v-for="(id, index) in 11"
              :key="id"
            >
              <PinInputInput
                class="rounded-md p-1 w-[30px] text-center border"
                :index="index"
              />
              <template v-if="index === 2">
                <PinInputSeparator />
              </template>
              <template v-if="index === 5">
                <PinInputSeparator />
              </template>
              <template v-if="index === 8">
                <PinInputSeparator />
              </template>
            </template>
          </PinInputGroup>
        </PinInput>
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
            color="neutral"
            class="w-full p-2.5"
            variant="subtle"
            icon="i-lucide-calendar"
          >
            {{ value ? df.format(toDate(value)) : "Выберите дату" }}
          </UButton>
          <template #content>
            <Calendar
              v-model:placeholder="placeholder"
              v-model="value"
              calendar-label="Дата рождения"
              initial-focus
              :min-value="new CalendarDate(1900, 1, 1)"
              :max-value="today(getLocalTimeZone())"
              @update:model-value="
                (v) => {
                  if (v) {
                    state.birth = v.toString();
                  } else {
                    state.birth = undefined;
                  }
                }
              "
            />
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
      <UFormField
        class="col-span-1"
        required
        size="xl"
        label="Пол"
        name="gender"
      >
        <USelect
          v-model="state.gender"
          :items="genders"
          class="w-48"
        />
      </UFormField>
    </div>
    <UButton
      size="xl"
      type="submit"
    >
      Зарегистрироваться
    </UButton>
  </UForm>
</template>
