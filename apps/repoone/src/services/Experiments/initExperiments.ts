import emitter from "react-ab-test/lib/emitter";
import { EXPERIMENTS, VARIANTS } from "./experiments";
import getGTag from "../../utils/App/getGTag";
import isOldSiteVisitor from "../../utils/App/isOldSiteVisitor";
import { LAYOUT_OPTIONS } from "../../types/enums/LAYOUT_OPTIONS";
import { getCookie, setCookie } from "../../utils/Html/cookies";

export const forceActiveExperiments = () => {
  emitter.setActiveVariant(EXPERIMENTS.HOME_HEADER, "full");
  emitter.setActiveVariant(
    EXPERIMENTS.POPULAR_STRAT_BUTTONS,
    "all_strats_only"
  );
};

export const initPreviousUserLayout = () => {
  const existing = getCookie(`EXP_${EXPERIMENTS.PREVIOUS_USER_LAYOUT}`);
  if (existing) {
    trackDimension(EXPERIMENTS.PREVIOUS_USER_LAYOUT, existing);
    return existing;
  }
  if (!existing) {
    const isOldSiteVisitorR = isOldSiteVisitor();
    const initialLayout = LAYOUT_OPTIONS.STACKED;
    const val =
      isOldSiteVisitorR && initialLayout === LAYOUT_OPTIONS.STACKED
        ? "STACKED_RETURNER"
        : !isOldSiteVisitorR && initialLayout === LAYOUT_OPTIONS.STACKED
        ? "STACKED_NEWUSER"
        : "unknown";
    setCookie(`EXP_${EXPERIMENTS.PREVIOUS_USER_LAYOUT}`, val);
    trackDimension(EXPERIMENTS.PREVIOUS_USER_LAYOUT, val);
    return val;
  }
  return "unknown";
};

export const trackDimension = (expName: string, varName: string) => {
  const gtag = getGTag();
  gtag?.("event", "set_dimension", {
    [expName]: varName,
    non_interaction: true,
  });
};

const initExperiments = () => {
  emitter.defineVariants(
    EXPERIMENTS.HOME_HEADER,
    VARIANTS[EXPERIMENTS.HOME_HEADER][0]
    // [0, 0, 100],
  );
  emitter.defineVariants(
    EXPERIMENTS.POPULAR_STRAT_BUTTONS,
    VARIANTS[EXPERIMENTS.POPULAR_STRAT_BUTTONS][0]
    // [0, 0, 100],
  );
  emitter.defineVariants(
    EXPERIMENTS.PREVIOUS_USER_LAYOUT,
    VARIANTS[EXPERIMENTS.PREVIOUS_USER_LAYOUT][0]
    // [0, 0, 100],
  );
  initPreviousUserLayout();

  // forceActiveExperiments();

  emitter.addActiveVariantListener(EXPERIMENTS.HOME_HEADER, trackDimension);
  emitter.addActiveVariantListener(
    EXPERIMENTS.POPULAR_STRAT_BUTTONS,
    trackDimension
  );
};

export default initExperiments;
