import { TokenState } from "./TokenState";
import { AuthStatusState } from "./AuthStatusState";
import {
  CurrentCalculationQuickView,
  CurrentCalculationState,
  MultiStrikeCalculation,
} from "./CurrentCalculationState";
import { UserSettingsState } from "./UserSettingsState";
import { CalculationsState } from "./CalculationsState";
import { PricesState } from "./PricesState";

export interface Store {
  token: TokenState;
  authStatus: AuthStatusState;
  currentCalculation: CurrentCalculationState;
  currentCalculations: CurrentCalculationState[];
  currentCalculationsStrategies: CurrentCalculationQuickView[];
  multiStrike: MultiStrikeCalculation[];
  multiStrikeToggle: boolean;
  calculations: CalculationsState;
  prices: PricesState;
  userSettings: UserSettingsState;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
}
