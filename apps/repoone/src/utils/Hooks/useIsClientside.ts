import { useState } from "react";
import useClientEffect from "./useClientEffect";

export default function useIsClientside() {
  const [isClientSide, setIsClientSide] = useState(false);
  useClientEffect(() => {
    setIsClientSide(true);
  });
  return isClientSide;
}
