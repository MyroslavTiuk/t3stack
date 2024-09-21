import { type UserSettingsState } from "opc-types/lib/store/UserSettingsState";
import { INPUT_METHODS } from "../../../../types/enums/INPUT_METHODS";
import { LAYOUT_OPTIONS } from "../../../../types/enums/LAYOUT_OPTIONS";

const selectBestInputMethod = (us: UserSettingsState, isMobile = false) => {
  const usedInputMethod = isMobile ? us.inputMethodMobile : us.inputMethod;
  return usedInputMethod !== INPUT_METHODS.DEFAULT
    ? usedInputMethod
    : isMobile
    ? INPUT_METHODS.INLINE
    : us.layout === LAYOUT_OPTIONS.SIDE_BY_SIDE
    ? INPUT_METHODS.INLINE
    : INPUT_METHODS.STACKED;
};

export default selectBestInputMethod;
