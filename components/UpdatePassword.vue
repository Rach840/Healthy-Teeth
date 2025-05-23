<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const showNewPassword = ref(false);
const showCurrentPassword = ref(false);
const errorPasswordMessage = ref("");
const toast = useToast();
const store = useAuthStore();

const schemaUpdatePassword = z.object({
  currentPassword: z.string().min(8, "Минимум 8  символов"),
  newPassword: z.string().min(8, "Минимум 8  символов"),
  confirmPassword: z.string().min(8, "Минимум 8  символов"),
});
type SchemaUpdatePassword = z.output<typeof schemaUpdatePassword>;
const { openPasswordEdit, updateOpen } = inject("openPasswordEdit");
const stateUpdatePassword = reactive<Partial<SchemaUpdatePassword>>({
  currentPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
});
const config = useRuntimeConfig();
async function onSubmitUpdatePassword(
  event: FormSubmitEvent<SchemaUpdatePassword>,
) {
  if (event.data.newPassword != event.data.confirmPassword) {
    errorPasswordMessage.value = "Пароли не совпадают";
    return;
  }
  const resp: Response = await $fetch(
    `${config.public.apiUrl}/users/updatePassword`,
    {
      method: "patch",
      body: JSON.stringify({
        currentPassword: event.data.currentPassword,
        newPassword: event.data.newPassword,
      }),
    },
  );
  if (resp.status === 201) {
    updateOpen();
    await store.refresh();
    toast.add({
      title: "Ваш пароль изменен.",
      icon: "i-lucide-check",
      color: "success",
    });
  }
  if (resp.status === 403) {
    errorPasswordMessage.value = resp.message;
  } else {
    toast.add({
      title: "Не предвидимая ошибка.",
      description: "Разработчик уже чинит ошибочку.",
      color: "error",
      icon: "i-lucide-circle-x",
    });
  }
}
</script>
<template>
  <UModal
    title="Изменить пароль"
    v-model:open="openPasswordEdit"
    description="Укажите старый пароль чтобы сменить его."
  >
    <template #body>
      <UForm
        :schema="schemaUpdatePassword"
        :state="stateUpdatePassword"
        @submit="onSubmitUpdatePassword"
        class="flex flex-col gap-4"
      >
        <UAlert
          v-if="errorPasswordMessage"
          color="error"
          :title="errorPasswordMessage"
          class="w-full"
          description="Поменяйте электронную почту или войдите"
          icon="i-lucide-terminal"
        />
        <UFormField
          label="Текущий пароль"
          name="currentPassword"
          size="xl"
          required
        >
          <UInput
            :type="showCurrentPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
            v-model="stateUpdatePassword.currentPassword"
          >
            <template #trailing>
              <UButton
                color="neutral"
                class="cursor-pointer"
                variant="link"
                size="xl"
                :icon="
                  showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                "
                :aria-label="
                  showCurrentPassword ? 'Hide password' : 'Show password'
                "
                :aria-pressed="showCurrentPassword"
                aria-controls="password"
                @click="showCurrentPassword = !showCurrentPassword"
              /> </template
          ></UInput>
        </UFormField>
        <UFormField
          label="Новый пароль"
          name="newPassword"
          size="xl"
          required
        >
          <UInput
            :type="showNewPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
            v-model="stateUpdatePassword.newPassword"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                class="cursor-pointer"
                size="xl"
                :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="
                  showNewPassword ? 'Hide password' : 'Show password'
                "
                :aria-pressed="showNewPassword"
                aria-controls="password"
                @click="showNewPassword = !showNewPassword"
              /> </template
          ></UInput>
        </UFormField>
        <UFormField
          label="Подтверждение пароля"
          name="confirmPassword"
          size="xl"
          required
        >
          <UInput
            v-model="stateUpdatePassword.confirmPassword"
            type="password"
            required
            class="w-full"
          />
        </UFormField>
        <div class="flex items-center justify-center">
          <UButton
            label="Сохранить пароль "
            type="submit"
            variant="soft"
            class="cursor-pointer self-end"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
