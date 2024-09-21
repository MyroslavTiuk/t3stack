import { type AppWindow } from "opc-types/lib/AppWindow";

const getGTag = (): Function | undefined => {
  if (typeof window === "undefined") return undefined;
  const { gtag } = window as AppWindow;
  if (typeof gtag !== "function") return;
  return gtag as Function;
};

export default getGTag;
