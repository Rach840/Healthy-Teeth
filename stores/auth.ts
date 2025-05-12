import { defineStore } from "pinia";
import type { User } from "~/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  }),

  actions: {
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },

    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    async refresh() {
      const config = useRuntimeConfig();
      const { accessToken: responseAccessToken }: { accessToken: string } =
        await $fetch(`${config.public.apiUrl}/auth/refresh`, {
          method: "post",
          credentials: "include",
        });
      console.log(responseAccessToken);
      this.setToken(responseAccessToken);

      const userByToken = await $fetch(`${config.public.apiUrl}/auth/profile`, {
        method: "get",
        credentials: "include",
        headers: new Headers({
          "Authorization": "Bearer " + responseAccessToken,
        }),
      });
      console.log(userByToken);
      this.setUser(userByToken);
    },

    async logout() {
      try {
        const config = useRuntimeConfig();
        const token = localStorage.getItem("token");
        if (!token) return;
        await $fetch(`${config.public.apiUrl}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } finally {
        this.clearAuth();
        await navigateTo("/");
      }
    },

    async checkAuth() {
      try {
        const config = useRuntimeConfig();
        const token = localStorage.getItem("token");
        if (!token) return false;

        const userByToken = await $fetch(
          `${config.public.apiUrl}/auth/profile`,
          {
            method: "get",
            credentials: "include",
            headers: new Headers({
              "Authorization": "Bearer " + token,
            }),
          },
        );

        this.setToken(token);
        this.setUser(userByToken);
        return true;
      } catch {
        this.clearAuth();
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
