import { useEffect, useRef } from "react";

export const useOutsideClick = (
  callback: () => void,
  listenCapturing: boolean = true,
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside, listenCapturing);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
        listenCapturing,
      );
    };
  }, [callback, listenCapturing]);

  return ref;
};
