import { type ReactNode } from "react";
import AuthGuardContainer from "./AuthGuard.container";
import { type AuthGuardOptions } from "./AuthGuard.props";

export const makeAuthGuard = (options: AuthGuardOptions) => {
  const filledOptions: AuthGuardOptions = {
    allowAnon: false,
    allowAuthed: false,
    allowUserGroups: [],
    ...options,
  };

  return function AuthGuard({ children }: { children: ReactNode }) {
    return AuthGuardContainer({ ...filledOptions, children });
  };
};
