import React from "react";
import { useRouter } from "next/router";

import { type Nullable } from "opc-types/lib/util/Nullable";

import { logoutFireBase } from "../../../../../services/Firebase";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import { authActions } from "../../../../store/actions";

import { AUTH_STATUS } from "../Session.types";

type Deps = [
  React.Dispatch<React.SetStateAction<AUTH_STATUS>>,
  // @ts-ignore
  React.Dispatch<React.SetStateAction<Nullable<firebase.User>>>
];

const useLogoutHandler = ([setAuthStatus, setUserAuth]: Deps) => {
  const router = useRouter();
  const dispatchLogout = useDispaction(authActions.logout);

  return React.useCallback(async () => {
    try {
      setAuthStatus(AUTH_STATUS.STATE_LOADING);
      await router.replace("/");
      await logoutFireBase();
      dispatchLogout();
      setUserAuth(null);
      setAuthStatus(AUTH_STATUS.STATE_ANON);
    } catch (e) {
      alert("Error logging out. please try again");
    }
  }, [router, dispatchLogout, setAuthStatus]);
};

export default useLogoutHandler;
