import { createFileRoute, redirect } from "@tanstack/react-router";
import { User } from "@/types";

export const Route = createFileRoute("/_auth_routes")({
  beforeLoad: () => {
    const user = localStorage.getItem("user");

    if (user) {
      const { token } = JSON.parse(user) as User;

      if (!token) {
        throw redirect({
          to: "/login",
          replace: true,
        });
      }
    } else {
      throw redirect({
        to: "/login",
        replace: true,
      });
    }
  },
});
