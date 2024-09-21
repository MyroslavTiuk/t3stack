import type React from "react";

import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";

import {
  AUTH_STATUS,
  LOGIN_ERRORS,
  type LoginRegistrationParams,
} from "../Session.types";
import { loginWithFirebase } from "../../../../../services/Firebase";

type Deps = [
  React.Dispatch<React.SetStateAction<AUTH_STATUS>>,
  // @ts-ignore
  React.Dispatch<React.SetStateAction<Nullable<firebase.User>>>
];

const LOGIN_ERROR_MAP: ObjRecord<LOGIN_ERRORS> = {
  "auth/user-not-found": LOGIN_ERRORS.EMAIL_ADDRESS_DOESNT_EXISTS,
  "auth/wrong-password": LOGIN_ERRORS.INVALID_CREDENTIALS,
};

const onLoginHandler = async (
  [setAuthStatus, setUserAuth]: Deps,
  [{ emailAddress, password }]: [LoginRegistrationParams]
) => {
  try {
    setAuthStatus(AUTH_STATUS.STATE_LOADING);
    const results = await loginWithFirebase(emailAddress, password);
    setUserAuth(results.user);
    setAuthStatus(AUTH_STATUS.STATE_AUTHED);
    return results;
  } catch (err) {
    const e: any = err;
    setAuthStatus(AUTH_STATUS.STATE_ANON);

    const errorCode = LOGIN_ERROR_MAP[e.code] || LOGIN_ERRORS.GENERIC_ERROR;
    return { errorCode };
  }
};

export default onLoginHandler;
