import { loginUser } from "../auth";
import api from "../api";

vi.mock("../api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("loginUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully login user", async () => {
    const mockResponse = {
      data: {
        token: "test-token",
      },
    };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const loginData = {
      username: "testuser",
      password: "password123",
    };

    const result = await loginUser(loginData);

    expect(api.post).toHaveBeenCalledWith("/login", loginData);
    expect(result).toEqual(mockResponse.data);
  });

  it("should throw error on failed login", async () => {
    const mockError = new Error("Login failed");
    vi.mocked(api.post).mockRejectedValueOnce(mockError);

    const loginData = {
      username: "testuser",
      password: "wrong-password",
    };

    await expect(loginUser(loginData)).rejects.toThrow("Login failed");
    expect(api.post).toHaveBeenCalledWith("/login", loginData);
  });

  it("should call API with correct parameters", async () => {
    const mockResponse = { data: { token: "test-token" } };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const loginData = {
      username: "testuser",
      password: "password123",
    };

    await loginUser(loginData);

    expect(api.post).toHaveBeenCalledWith("/login", loginData);
    expect(api.post).toHaveBeenCalledTimes(1);
  });
});
