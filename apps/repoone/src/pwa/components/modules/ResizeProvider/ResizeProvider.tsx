import { type FC, useCallback, useEffect, useState } from "react";
import React from "react";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";

import type Box from "../../primitives/Box";

import getWindow from "../../../../utils/Html/getWindow";
import throttle from "../../../../utils/throttle/throttle";

export const ResizeContext = React.createContext({
  width: 375,
});

type ResizeProviderProps = CompWithChildren;

const useResizeListener = () => {
  const win = getWindow();
  const [width, setWidth] = useState(null as Nullable<number>);

  const setWidthThrottled = useCallback(
    throttle(() => {
      if (win) {
        win?.document?.documentElement?.style?.setProperty?.(
          "--scrollbarWidth",
          `${
            (win?.innerWidth || 0) - (win?.document?.body?.clientWidth || 0)
          }px`
        );
        setWidth(win?.innerWidth || null);
      }
    }, 50),
    [setWidth, win]
  );

  const timeoutId = React.useRef(
    null as Nullable<ReturnType<typeof setInterval>>
  );

  useEffect(() => {
    if (timeoutId.current) clearInterval(timeoutId.current);
    win?.addEventListener("resize", setWidthThrottled);
    // timeoutId.current = setInterval(setWidthThrottled, 1000);
    return () => {
      win?.removeEventListener("resize", setWidthThrottled);
      if (timeoutId.current) {
        clearInterval(timeoutId.current);
      }
      return;
    };
  }, []);

  return width;
};

const ResizeProvider: FC<ResizeProviderProps> = (
  props: ResizeProviderProps
): ReturnType<typeof Box> => {
  const width = useResizeListener();

  return (
    <ResizeContext.Provider
      value={{
        width: width || 375,
      }}
    >
      {props.children}
    </ResizeContext.Provider>
  );
};

export default ResizeProvider;
