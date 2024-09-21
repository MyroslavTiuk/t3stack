import { type UserSettings } from "opc-types/lib/UserSettings";
import { type Nullable } from "opc-types/lib/util/Nullable";

export interface LoginRegistrationParams {
  emailAddress: string;
  password: string;
}
export interface RegistrationParams extends LoginRegistrationParams {
  firstName: string;
  emailUpdates: boolean;
}

export enum AUTH_STATUS {
  STATE_ERROR = "STATE_ERROR",
  STATE_LOADING = "STATE_LOADING",
  STATE_ANON = "STATE_ANON",
  STATE_AUTHED = "STATE_AUTHED",
}

export type Profile = {
  firstName: Nullable<string>;
  emailUpdates: boolean;
};

export interface UserData {
  id: string;
  emailAddress: string;
  profile: Profile;
  userSettings: UserSettings;
  profileLoaded: boolean;
}

export enum REGISTRATION_ERRORS {
  EMAIL_ALREADY_USED = "EMAIL_ALREADY_USED",
  INVALID_EMAIL = "INVALID_EMAIL",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  GENERIC_ERROR = "GENERIC_ERROR",
}

export enum LOGIN_ERRORS {
  EMAIL_ADDRESS_DOESNT_EXISTS = "EMAIL_ADDRESS_DOESNT_EXISTS",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  GENERIC_ERROR = "GENERIC_ERROR",
}

export interface LoginRegistrationViewProps {
  headerText?: string;
  onLoginSuccess?: () => void;
  onCancel?: () => void;
  prefillEmail?: string;
}
