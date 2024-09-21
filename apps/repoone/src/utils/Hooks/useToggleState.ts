import { useCallback, useState } from "react";
import usePartialledCallback from "./usePartialledCallback";

const useToggleState = (dflt = false) => {
  const [value, setValue] = useState(dflt);
  const enable = usePartialledCallback(setValue, [true]);
  const disable = usePartialledCallback(setValue, [false]);
  const toggle = useCallback(() => setValue((v) => !v), [setValue]);
  return {
    value,
    setValue,
    enable,
    disable,
    toggle,
  };
};

export default useToggleState;
