import { type UserData } from "../Session.types";
import { DEFAULT_USER_SETTINGS_STATE } from "../../../../store/reducers/userSettings";

const defaultUserData: UserData = {
  id: "",
  emailAddress: "",
  profile: {
    firstName: null,
    emailUpdates: false,
  },
  userSettings: DEFAULT_USER_SETTINGS_STATE,
  profileLoaded: false,
};

export default defaultUserData;
