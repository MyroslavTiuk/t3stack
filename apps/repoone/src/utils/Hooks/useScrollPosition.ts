import { useState, useLayoutEffect, useCallback, useRef } from "react";

export const useScrollPosition = () => {
  // @ts-ignore
  const win: Window = typeof window === "undefined" ? {} : window;
  const scrollListener = useRef(() => {});

  const brect = win?.document?.body?.getBoundingClientRect();
  const [state, setState] = useState({
    lastScrollTop: 0,
    // bodyOffset: getBoundingClientRect,
    scrollY: brect?.top,
    scrollX: brect?.left,
    scrollDirection: "", // down, up
  });

  const handleScrollEvent = useCallback(() => {
    setState((prevState) => {
      const prevLastScrollTop = prevState.lastScrollTop;
      const bodyOffset = win?.document?.body?.getBoundingClientRect?.();

      return {
        // bodyOffset,
        scrollY: -bodyOffset.top,
        scrollX: bodyOffset.left,
        scrollDirection: prevLastScrollTop > -bodyOffset.top ? "down" : "up",
        lastScrollTop: -bodyOffset.top,
      };
    });
  }, [!!win]);

  useLayoutEffect(() => {
    if (win) {
      scrollListener.current = handleScrollEvent;
      win?.addEventListener("scroll", scrollListener.current);
    }
    return () => {
      win?.removeEventListener("scroll", scrollListener.current);
    };
  }, [!!win]);

  return {
    scrollY: state.scrollY,
    scrollX: state.scrollX,
    scrollDirection: state.scrollDirection,
  };
};

export default useScrollPosition;
