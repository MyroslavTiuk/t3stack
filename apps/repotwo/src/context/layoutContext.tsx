import React, { createContext, useContext, useEffect, useState } from "react";

type LayoutContextType = {
  showFooter: boolean;
  setShowFooter: (input: boolean) => void;
};

export const LayoutContext = createContext<LayoutContextType>(
  {} as LayoutContextType
);

export const LayoutContextProvider: React.FC<Props> = ({ children }) => {
  const [showFooter, setShowFooter] = useState(true);

  return (
    <LayoutContext.Provider value={{ showFooter, setShowFooter }}>
      {children}
    </LayoutContext.Provider>
  );
};

type Props = {
  children: React.ReactNode;
};

export function useDisableFooter() {
  const { setShowFooter } = useContext(LayoutContext);
  useEffect(() => {
    setShowFooter(false);
    return () => setShowFooter(true);
  }, [setShowFooter]);
}
