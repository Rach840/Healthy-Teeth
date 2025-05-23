import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return;
  const authStore = useAuthStore();
  onMounted(async () => {
    await authStore.checkAuth();
  });

  // If user is not authenticated and trying to access a protected route
  if (!authStore.user) {
    return navigateTo("/login");
  }
});
