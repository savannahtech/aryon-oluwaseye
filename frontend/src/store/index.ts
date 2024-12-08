import { create } from "zustand";
import { combine } from "zustand/middleware";
import { User } from "@/types";
import { loginUser } from "@/services/auth";
import { toastError } from "@/utils";
import { router } from "@/App";

const useStore = create(
  combine({ showMenu: false, user: null as User | null }, (set) => ({
    toggleMenu: (showMenu?: boolean) => {
      if (typeof showMenu === "boolean") {
        set({ showMenu });
      } else {
        set((state) => ({ showMenu: !state.showMenu }));
      }
    },
    login: async (data: { username: string; password: string }) => {
      try {
        const res = await loginUser(data);
        const userData: User = { username: data.username, token: res.token };
        localStorage.setItem("user", JSON.stringify(userData));
        set({ user: userData });
        router.navigate({ to: "/dashboard", replace: true });
      } catch (error) {
        toastError(error);
      }
    },
    logout: () => {
      localStorage.removeItem("user");
      set({ user: null });
      router.navigate({ to: "/login", replace: true });
    },
  })),
);

export default useStore;
