import ifUndef from "../../../../../utils/Data/ifUndef/ifUndef";
import { type Profile } from "../Session.types";

const ensureUserSettings = (foreignProfile: any): Profile => {
  return {
    firstName: ifUndef(foreignProfile.firstName, null),
    emailUpdates: ifUndef(foreignProfile.emailUpdates, false),
  };
};

export default ensureUserSettings;
