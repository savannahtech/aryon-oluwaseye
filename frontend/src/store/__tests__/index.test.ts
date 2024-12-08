import useStore from "../index";
import { loginUser } from "@/services/auth";
import { router } from "@/App";
import { toastError } from "@/utils";

vi.mock("@/services/auth", () => ({
  loginUser: vi.fn(),
}));

vi.mock("@/App", () => ({
  router: {
    navigate: vi.fn(),
  },
}));

vi.mock("@/utils", () => ({
  toastError: vi.fn(),
}));

describe("useStore", () => {
  beforeEach(() => {
    useStore.setState({
      user: null,
      showMenu: false,
    });

    vi.clearAllMocks();

    localStorage.clear();
  });

  it("should initialize with default values", () => {
    const state = useStore.getState();
    expect(state.user).toBeNull();
    expect(state.showMenu).toBe(false);
  });

  it("should set showMenu", () => {
    const { toggleMenu } = useStore.getState();
    toggleMenu(true);
    expect(useStore.getState().showMenu).toBe(true);
  });

  it("should toggle showMenu", () => {
    const { toggleMenu } = useStore.getState();
    toggleMenu();
    expect(useStore.getState().showMenu).toBe(true);
  });

  it("should handle successful login", async () => {
    const mockToken = "test-token";
    const loginData = { username: "testuser", password: "password" };

    vi.mocked(loginUser).mockResolvedValueOnce({ token: mockToken });

    const { login } = useStore.getState();
    await login(loginData);

    const state = useStore.getState();
    expect(state.user).toEqual({
      username: loginData.username,
      token: mockToken,
    });

    expect(router.navigate).toHaveBeenCalledWith({
      to: "/dashboard",
      replace: true,
    });
  });

  it("should handle failed login", async () => {
    const error = new Error("Login failed");
    vi.mocked(loginUser).mockRejectedValueOnce(error);

    const { login } = useStore.getState();
    await login({ username: "testuser", password: "wrong" });

    expect(toastError).toHaveBeenCalledWith(error);
    expect(useStore.getState().user).toBeNull();
  });

  it("should handle logout", () => {
    useStore.setState({
      user: { username: "testuser", token: "token" },
    });

    const { logout } = useStore.getState();
    logout();

    expect(useStore.getState().user).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();

    expect(router.navigate).toHaveBeenCalledWith({
      to: "/login",
      replace: true,
    });
  });
});
