import { INPUT_METHODS } from "opc-types/lib/INPUT_METHODS";
import { LAYOUT_OPTIONS } from "opc-types/lib/LAYOUT_OPTIONS";
import { type ReactNode, createContext, useEffect, useState } from "react";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";
import { api } from "~/utils/api";

export interface CalculatorUserViewSettings {
  screenLayout: LAYOUT_OPTIONS;
  optionLegStyle: INPUT_METHODS;
}

export interface NewSavedCalcsContextType {
  isRefetch?: boolean;
  setIsRefetch: (value: boolean) => void;
  disableFocus?: boolean;
  setDisableFocus: (value: boolean) => void;
  calculatorUserViewSettings: CalculatorUserViewSettings;
  setCalculatorUserViewSettings: (value: CalculatorUserViewSettings) => void;
  isSidebarOpened: boolean;
  setIsSidebarOpened: (value: boolean) => void;
  changeViewSettingsLayout: (value: string) => void;
  changeViewSettingsOptionLeg: (value: string) => void;
}

export const NewSavedCalcsContext = createContext<
  NewSavedCalcsContextType | undefined
>(undefined);

export const NewSavedCalcsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isRefetch, setIsRefetch] = useState<boolean>(false);
  const [disableFocus, setDisableFocus] = useState<boolean>(false);
  const [isSidebarOpened, setIsSidebarOpened] = useState<boolean>(true);
  const [calculatorUserViewSettings, setCalculatorUserViewSettings] =
    useState<CalculatorUserViewSettings>({
      screenLayout: LAYOUT_OPTIONS.STACKED,
      optionLegStyle: INPUT_METHODS.DEFAULT,
    });

  const { data: viewSettingsData } =
    api.calculations.getViewSettings.useQuery();

  const matches = useMediaQueryCustom("(max-width: 500px)");

  useEffect(() => {
    if (matches) {
      setCalculatorUserViewSettings({
        screenLayout: LAYOUT_OPTIONS.SIDE_BY_SIDE,
        optionLegStyle: INPUT_METHODS.INLINE,
      });
    } else {
      if (viewSettingsData) {
        setCalculatorUserViewSettings({
          screenLayout: viewSettingsData.data.screenLayout as LAYOUT_OPTIONS,
          optionLegStyle: viewSettingsData.data.optionLegStyle as INPUT_METHODS,
        });
      }
    }
  }, [viewSettingsData, matches]);

  const mutatorViewSettings = api.calculations.setViewSettings.useMutation();

  const changeViewSettingsLayout = (value: string) => {
    mutatorViewSettings.mutateAsync({
      screenLayout: value,
    });
  };

  const changeViewSettingsOptionLeg = (value: string) => {
    mutatorViewSettings.mutateAsync({
      optionLegStyle: value,
    });
  };

  return (
    <NewSavedCalcsContext.Provider
      value={{
        isRefetch,
        setIsRefetch,
        disableFocus,
        setDisableFocus,
        calculatorUserViewSettings,
        setCalculatorUserViewSettings,
        isSidebarOpened,
        setIsSidebarOpened,
        changeViewSettingsLayout,
        changeViewSettingsOptionLeg,
      }}
    >
      {children}
    </NewSavedCalcsContext.Provider>
  );
};
