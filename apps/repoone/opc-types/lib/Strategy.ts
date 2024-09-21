import {
  type StratLeg,
  type StratLegComplete,
  type StratLegDef,
} from "./StratLeg";
import { type StratName } from "./StratName";
import { type Nullable } from "./util/Nullable";
import { type DisplayValueTypes } from "./DisplayValueTypes";
import { type StrategyEstimate } from "./StrategyEstimate";
import { type MATRIX_YAXIS_TYPES } from "./MATRIX_YAXIS_TYPES";
import { type CALCULATION_PERMISSION } from "./CALCULATION_PERMISSION";

// type Sentiment = 'bullish' | 'bearish' | 'targetted' | 'volatile';

// note: Allows for more complex behaviour
enum MENU_VISIBILITY {
  HIDE = "HIDE",
  SHOW = "SHOW",
}

export interface StrategyDef {
  title: string;
  titleShort?: string;
  metadata: {
    menuVisibility?: MENU_VISIBILITY;
    stratKey: StratName;
    category: {
      sentiment?: string | string[]; // Sentiment | Sentiment[],
      complexity?: string | string[]; // 'single' | 'spread' | 'multileg',
      naked?: boolean;
      married?: boolean;
    };
    keywords?: string[];
    helpDescription?: string;
    helpMoreLink?: string;
  };
  settings: {
    inputOptions?: ("initial" | "downside" | "manual")[];
    access: string; // todo: use some access type
    showLinkOpTypes?: boolean;
    showLinkExpiries?: boolean;
    showLinkStrikes?: boolean;
    showLinkNum?: boolean;
  };
  // input_preference: 'by_leg' | 'spread' | ...?;
  underlyingElement?: string;
  defaults: {
    underlyingElement: string;
    changeOpType?: boolean;
    changeAct?: boolean;
    linkExpiries?: boolean;
    linkStrikes?: boolean;
    linkOpTypes?: boolean;
    linkNum?: boolean;
  };
  legsById: {
    [k: string]: StratLegDef;
  };
  legs?: string[];
}

export interface Strategy extends StrategyDef {
  id: Nullable<string>;
  underlyingElement: string;
  changeOpType: boolean;
  changeAct: boolean;
  linkExpiries: boolean;
  linkStrikes: boolean;
  linkOpTypes: boolean;
  linkNum: boolean;
  metadata: StrategyDef["metadata"] & {
    category: Omit<StrategyDef["metadata"]["category"], "naked" | "married"> & {
      naked: boolean;
      married: boolean;
    };
  };
  settings: StrategyDef["settings"] & {
    showLinkOpTypes: boolean;
    showLinkExpiries: boolean;
    showLinkStrikes: boolean;
    showLinkNum: boolean;
  };
  legsById: {
    [k: string]: StratLeg;
  };
  displayValueType: DisplayValueTypes;
  matrixSecondaryYAxisType: MATRIX_YAXIS_TYPES;
  priceRange: [Nullable<number>, Nullable<number>];
  ivShift: Nullable<number>; // This is a multiplier, e.g. 1 is no shift (but that should be stored as null)
  atmIV: Nullable<number>; // The ATM IV at time of calculation
  histIV: Nullable<number>; // The historical IV at time of calculation
  timeFrame: Nullable<"existing" | "new">;
  // Time of calculation should be updated to when each leg's IV was set (as this is tied to time-til-expiration)
  timeOfCalculation: Nullable<number>;
  // * OriginalEstimate is updated when dependent leg fields are updated (e.g. Expiry / strike)
  //    - It should not be updated during 'updateEstimate'(?) actions, where the latest prices/IV are pulled and set
  originalEstimate: Nullable<StrategyEstimate>;
  // * This stores the order of the StratLegs that are in legsById
  legs: string[];
  imported?: boolean;
  permission: CALCULATION_PERMISSION;
  readOnly?: boolean;
}

export interface StrategyComplete extends Strategy {
  legsById: {
    [k: string]: StratLegComplete;
  };
  atmIV: number;
  originalEstimate: StrategyEstimate;
  timeOfCalculation: number;
}
