import {
  archiveRecommendation,
  getArchivedRecommendations,
  getRecommendations,
  unarchiveRecommendation,
} from "../recommendations";
import api from "../api";

vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("getRecommendations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle pagination parameters", async () => {
    const mockResponse = { data: { data: [], pagination: { cursor: {} } } };
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    await getRecommendations({ cursor: "next-page", limit: 20 });

    expect(api.get).toHaveBeenCalledWith("/recommendations", {
      params: { cursor: "next-page", limit: 20 },
    });
  });

  it("should handle archive pagination parameters", async () => {
    const mockResponse = { data: { data: [], pagination: { cursor: {} } } };
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    await getArchivedRecommendations({ cursor: "next-page", limit: 20 });

    expect(api.get).toHaveBeenCalledWith("/recommendations/archive", {
      params: { cursor: "next-page", limit: 20 },
    });
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    vi.mocked(api.get).mockRejectedValueOnce(mockError);

    await expect(getRecommendations({})).rejects.toThrow("API Error");
  });

  it("should combine multiple parameters", async () => {
    const mockResponse = { data: { data: [], pagination: { cursor: {} } } };
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

    await getRecommendations({
      cursor: "next-page",
      limit: 20,
      search: "test",
      tags: "AWS",
    });

    expect(api.get).toHaveBeenCalledWith("/recommendations", {
      params: {
        cursor: "next-page",
        limit: 20,
        search: "test",
        tags: "AWS",
      },
    });
  });

  it("should archive a recommendation", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await archiveRecommendation("123");
    expect(result).toEqual(mockResponse.data);
    expect(api.post).toHaveBeenCalledWith("/recommendations/123/archive");
  });

  it("should unarchive a recommendation", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

    const result = await unarchiveRecommendation("123");
    expect(result).toEqual(mockResponse.data);
    expect(api.post).toHaveBeenCalledWith("/recommendations/123/unarchive");
  });
});
