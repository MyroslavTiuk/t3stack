// Hook

import { useEffect, RefObject } from "react";

type EventListener = (event: MouseEvent | TouchEvent) => void;

export default function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: EventListener
) {
  useEffect(() => {
    const listener: EventListener = (event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
