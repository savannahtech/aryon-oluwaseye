import { renderHook, act } from "@testing-library/react";
import useDebounce from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 1000));
    expect(result.current).toBe("test");
  });

  it("should update value after specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "test", delay: 1000 } },
    );

    rerender({ value: "updated", delay: 1000 });
    expect(result.current).toBe("test");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("updated");
  });
});
