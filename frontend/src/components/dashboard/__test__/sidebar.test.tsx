import { render, screen, fireEvent } from "@testing-library/react";
import useStore from "@/store";
import Sidebar from "../sidebar";

vi.mock("@/store", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("Sidebar Component", () => {
  const mockLogout = vi.fn();
  const mockToggleMenu = vi.fn();

  beforeEach(() => {
    // @ts-expect-error vi.Mock error
    (useStore as vi.Mock).mockReturnValue({
      logout: mockLogout,
      showMenu: true,
      toggleMenu: mockToggleMenu,
    });
    render(<Sidebar />);
  });

  it("renders the sidebar with the correct title", () => {
    const titleElement = screen.getByText(/ARYON/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the navigation items", () => {
    const navItems = ["Dashboard", "Recommendations", "Policies", "Events"];
    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("calls logout function when Logout button is clicked", () => {
    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it("sets recommendations list overflow style based on showMenu state", () => {
    const recommendationsList = document.createElement("div");
    recommendationsList.className = "recommendations-list";
    document.body.appendChild(recommendationsList);

    // @ts-expect-error vi.Mock error
    (useStore as vi.Mock).mockReturnValueOnce({
      logout: mockLogout,
      showMenu: true,
      toggleMenu: mockToggleMenu,
    });
    render(<Sidebar />);
    expect(recommendationsList.style.overflow).toBe("hidden");

    // @ts-expect-error vi.Mock error
    (useStore as vi.Mock).mockReturnValueOnce({
      logout: mockLogout,
      showMenu: false,
      toggleMenu: mockToggleMenu,
    });
    render(<Sidebar />);
    expect(recommendationsList.style.overflow).toBe("auto");

    document.body.removeChild(recommendationsList);
  });
});
