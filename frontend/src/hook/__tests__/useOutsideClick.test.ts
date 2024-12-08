import { renderHook } from "@testing-library/react";
import { useOutsideClick } from "../useOutsideClick";
import { fireEvent } from "@testing-library/dom";

describe("useOutsideClick", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call callback when clicking outside", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useOutsideClick(callback));

    const insideElement = document.createElement("div");
    Object.defineProperty(result.current, "current", {
      value: insideElement,
      writable: true,
    });

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);
    fireEvent.mouseDown(outsideElement);

    expect(callback).toHaveBeenCalledTimes(1);
    document.body.removeChild(outsideElement);
  });

  it("should not call callback when clicking inside", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useOutsideClick(callback));

    const insideElement = document.createElement("div");

    Object.defineProperty(result.current, "current", {
      value: insideElement,
      writable: true,
    });

    fireEvent.mouseDown(insideElement);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should respect listenCapturing parameter", () => {
    const callback = vi.fn();
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useOutsideClick(callback, false));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
      false,
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
      false,
    );
  });

  it("should cleanup event listener on unmount", () => {
    const callback = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useOutsideClick(callback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });

  it("should not call callback when ref.current is null", () => {
    const callback = vi.fn();
    renderHook(() => useOutsideClick(callback));

    fireEvent.mouseDown(document.body);

    expect(callback).not.toHaveBeenCalled();
  });
});
