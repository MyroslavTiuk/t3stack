import { type Profile } from "../Session/Session.types";

export enum UserSettingsTabOptions {
  Account = "My Account",
  Calculator = "Calculator Settings",
}

export type UpdateAccountParams = {
  emailAddress: string;
  password: string;
} & Profile;

export enum UpdateAccountErrorCodes {
  SIGN_IN_REQUIRED = "auth/requires-recent-login",
  EMAIL_ALREADY_USED = "auth/email-already-in-use",
}
