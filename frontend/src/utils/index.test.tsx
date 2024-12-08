import toast from "react-hot-toast";
import { CloudIcons, toastError } from "./index";
import { CloudProvider } from "../types";

describe("Utils", () => {
  describe("CloudIcons", () => {
    it("should have correct path for AWS provider", () => {
      expect(CloudIcons[CloudProvider.AWS]).toBe("/aws.png");
    });

    it("should have correct path for Azure provider", () => {
      expect(CloudIcons[CloudProvider.AZURE]).toBe("/azure.png");
    });

    it("should have correct path for unspecified provider", () => {
      expect(CloudIcons[CloudProvider.UNSPECIFIED]).toBe("/cloud.png");
    });
  });

  describe("toastError", () => {
    beforeEach(() => {
      vi.mock("react-hot-toast", () => ({
        default: {
          error: vi.fn(),
        },
      }));
    });

    it("should show error message from response", () => {
      const error = {
        response: {
          data: {
            error: "Test error message",
          },
        },
      };
      toastError(error);
      expect(toast.error).toHaveBeenCalledWith("Test error message", {
        duration: 7000,
      });
    });

    it("should show default error message when no response error", () => {
      toastError({});
      expect(toast.error).toHaveBeenCalledWith("An error occured", {
        duration: 7000,
      });
    });
  });
});
