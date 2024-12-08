import { routerFactory } from "@/utils";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";

function renderComponent(path: string) {
  const router = routerFactory(createMemoryHistory({ initialEntries: [path] }));
  const view = render(<RouterProvider router={router} />);
  return { view, router };
}

describe("dashboard route", () => {
  beforeEach(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: "test",
        token: "test-token",
      }),
    );
  });

  afterEach(() => {
    localStorage.removeItem("user");
  });

  test("redirect to login", async () => {
    localStorage.removeItem("user");
    const { router, view } = renderComponent("/dashboard");

    await waitFor(() => {
      expect(router.history.location.pathname).toBe("/login");
      expect(
        view.getByRole("heading", { name: /login to your account/i }),
      ).toBeInTheDocument();
    });
  });

  test("redirect to login when no token", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: "test",
      }),
    );
    const { router, view } = renderComponent("/dashboard");

    await waitFor(() => {
      expect(router.history.location.pathname).toBe("/login");
      expect(
        view.getByRole("heading", { name: /login to your account/i }),
      ).toBeInTheDocument();
    });
  });

  test("renders the dashboard page", async () => {
    const { router } = renderComponent("/dashboard");

    await waitFor(() => {
      expect(router.history.location.pathname).toBe("/dashboard");
    });
  });
});
