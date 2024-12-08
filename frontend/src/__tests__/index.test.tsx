import { routerFactory } from "@/utils";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { render, waitFor } from "@testing-library/react";

function renderComponent(path: string) {
  const router = routerFactory(createMemoryHistory({ initialEntries: [path] }));
  const view = render(<RouterProvider router={router} />);
  return { view, router };
}

describe("index route", () => {
  test("renders the login page", async () => {
    const { router } = renderComponent("/");

    await waitFor(() => {
      expect(router.history.location.pathname).toBe("/login");
    });
  });

  test("redirect to dashboard", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: "test",
        token: "test-token",
      }),
    );

    const { router } = renderComponent("/");

    await waitFor(() => {
      expect(router.history.location.pathname).toBe("/dashboard");
    });
  });

  test("redirect to login", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: "test",
      }),
    );
    const { router } = renderComponent("/");

    await waitFor(() => {
      expect(router.history.location.pathname).toBe("/login");
    });
  });
});
