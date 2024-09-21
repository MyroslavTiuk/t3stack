import ifUndef from "../utils/Data/ifUndef/ifUndef";

import { type AdPlacement } from "opc-types/lib/AdPlacement";
import { type Optional } from "opc-types/lib/util/Optional";
import Env from "./Env";
import { AD_POSITIONS } from "../types/enums/AD_POSITIONS";

const PLACEMENTS: Record<AD_POSITIONS, Optional<AdPlacement>> = {
  [AD_POSITIONS.CALC_TOP_MOB]: {
    minWidth: 320,
    minHeight: 50,
    maxHeight: 100,
    fuseName: "header_test",
    fuseId: "22159144144",
  },
  [AD_POSITIONS.CALC_TOP_SMALL]: {
    minWidth: 728,
    minHeight: 90,
    fuseName: "header_test",
    fuseId: "22159144144",
  },
  [AD_POSITIONS.CALC_TOP_BANNER]: {
    minWidth: 728,
    minHeight: 90,
    fuseName: "header_test",
    fuseId: "22159144144",
  },
  [AD_POSITIONS.CALC_LEFT_SKYSCRAPER]: {
    minWidth: 120,
    minHeight: 250,
    maxWidth: 336,
    maxHeight: 600,
    fuseName: "test_vrec_lhs",
    fuseId: "22245655278",
  },
  [AD_POSITIONS.CALC_RIGHT_SKYSCRAPER]: {
    minWidth: 120,
    minHeight: 600,
    maxWidth: 160,
    maxHeight: 600,
    fuseName: "test_vrec_rhs",
    fuseId: "22245273196",
  },
  [AD_POSITIONS.CALC_MOBILE_BOTTOM_SQUARE]: {
    minWidth: 300,
    minHeight: 250,
    maxWidth: 336,
    maxHeight: 280,
    fuseName: "test_footer",
    fuseId: "22245654288",
  },
  [AD_POSITIONS.DESKTOP_BOTTOM]: {
    minWidth: 728,
    minHeight: 90,
    maxWidth: 970,
    maxHeight: 90,
    fuseName: "test_footer",
    fuseId: "22245654288",
  },
  [AD_POSITIONS.MOBILE_STICKY]: {
    minWidth: 300,
    minHeight: 50,
    maxWidth: 336,
    maxHeight: 100,
    fuseName: "mob_footer_sticky",
    fuseId: "22245273199",
  },
  [AD_POSITIONS.CONTENT_SIDE]: {
    minWidth: 300,
    minHeight: 250,
    maxWidth: 336,
    maxHeight: 280,
    fuseName: "test_mrec_1",
    fuseId: "22245655281",
  },
};

const USE_PLACEHOLDER_ADS = process?.env?.use_placeholder_ads;

export const ADS = {
  USE_PLACEHOLDER_ADS: Boolean(
    ifUndef<string | boolean>(USE_PLACEHOLDER_ADS, Env.IS_DEV)
  ),
  PLACEMENTS,
};
