import React, { createContext, useContext, useEffect, useState } from "react";
// import { useDispatch } from "react-redux";

import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type UserSettings } from "opc-types/lib/UserSettings";
import { type Action } from "opc-types/lib/store/Action";
import { type Nullable } from "opc-types/lib/util/Nullable";
import noop from "../../../../utils/Functional/noop";
import { DEFAULT_USER_SETTINGS_STATE } from "../../../store/reducers/userSettings";
import useSelectorSafe from "../../../store/selectors/useSelectorSafe";
// import useDispaction from "../../../../utils/Redux/useDispaction";
// import { authActions } from "../../../store/actions";

import defaultUserData from "./helpers/defaultUserData";
import ensureUserSettings from "./helpers/ensureUserSettings";

import { AUTH_STATUS, type UserData } from "./Session.types";
import Interface from "../../../../config/Interface";
import ifUndef from "../../../../utils/Data/ifUndef/ifUndef";

const SessionContext = createContext({
  authStatus: AUTH_STATUS.STATE_LOADING,
  // onLogin: (() => Promise.resolve({})) as (
  //   params: LoginRegistrationParams
  // ) => Promise<any>,
  // onRegister: (() => Promise.resolve({})) as (
  //   params: RegistrationParams
  // ) => Promise<any>,
  // onLogout: noop,
  userData: defaultUserData,
  dispatchUserSettings: noop as (action: Action<any>) => void,
  dispactionUserSettings: (() => noop) as <A extends any[], P>(
    actionCreator: (...args: A) => Action<P>
  ) => (...args: A) => void,
  setSessionCalculations: noop as (calcs: StrategyComplete[]) => void,
  userHasRegistered: false,
});

interface User {
  uid: string;
  isAnonymous: boolean;
  email: string;
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [calculations, setSessionCalculations] = useState<StrategyComplete[]>(
    []
  );

  const [userAuth, setUserAuth] = useState<Nullable<User>>(null);
  const isAnon = ifUndef(userAuth?.isAnonymous, true);
  const [authStatus, setAuthStatus] = useState<AUTH_STATUS>(
    AUTH_STATUS.STATE_LOADING
  );
  const [, setPendingSettingsCreate] = React.useState(false);

  const userSettingsFromRedux: UserSettings = useSelectorSafe(
    (store) => ensureUserSettings(store.userSettings),
    DEFAULT_USER_SETTINGS_STATE
  );
  //const userDocumentData = useUpdatedUserData(userAuth?.uid);

  const authAnonymously = React.useCallback(() => {
    setAuthStatus(AUTH_STATUS.STATE_LOADING);
    setAuthStatus(AUTH_STATUS.STATE_ANON);
  }, [setUserAuth, setPendingSettingsCreate]);
  const authAnonymouslyCriteria = (calculations || []).length > 0;
  const authAnonymouslyTrigger =
    Interface.ENABLE_ANONYMOUS_AUTH &&
    Interface.ANONYMOUS_AUTH_WAIT_FOR_CALC &&
    authStatus === AUTH_STATUS.STATE_ANON &&
    !userAuth?.uid &&
    authAnonymouslyCriteria;
  React.useEffect(() => {
    if (authAnonymouslyTrigger) authAnonymously();
  }, [authAnonymouslyTrigger]);

  // const createAnonProfileTrigger =
  //   pendingSettingsCreate &&
  //   userAuth?.uid &&
  //   userAuth.isAnonymous &&
  //   !userDocumentData;
  const createAnonProfileTrigger = false;
  React.useEffect(() => {
    if (createAnonProfileTrigger && userAuth) {
      setPendingSettingsCreate(false);
      // const anonUserProfile = {
      //   firstName: null,
      //   emailUpdates: false,
      // };
      // postAuthProcess(
      //   userAuth,
      //   [
      //     setAuthStatus,
      //     setUserAuth,
      //     userSettingsFromRedux,
      //     calculations,
      //     dispatchAuthenticated,
      //   ],
      //   anonUserProfile
      // );
    }
  }, [createAnonProfileTrigger]);

  useEffect(function registerAuthChangeListener() {
    setAuthStatus(AUTH_STATUS.STATE_ANON);
  }, []);

  // const onLogin = useDependentCallback(onLoginHandler, [
  //   setAuthStatus,
  //   setUserAuth,
  // ]);
  //const dispatchAuthReg = useDispaction(authActions.newRegistrationSuccess);
  // const onRegisterSuccess = React.useCallback(() => {
  //   dispatchAuthReg();
  //   dispatchAuthenticated();
  // }, [dispatchAuthReg, dispatchAuthenticated]);
  // const onRegister = useDependentCallback(onRegisterHandler, [
  //   setAuthStatus,
  //   setUserAuth,
  //   userSettingsFromRedux,
  //   calculations,
  //   onRegisterSuccess,
  // ]);
  // const onLogout = useLogoutHandler([setAuthStatus, setUserAuth]);
  const dispatchUserSettings = React.useCallback(
    () =>
      // action: Action<any>
      {
        // if (userAuth?.uid) {
        //   const newUserSettings = userSettingsReducer(
        //     {
        //       ...(userDocumentData?.userSettings || userSettingsFromRedux),
        //     },
        //     action
        //   );
        //
        //   try {
        //     // UsersCollection.doc(userAuth?.uid).set(
        //     //   {
        //     //     userSettings: newUserSettings,
        //     //   },
        //     //   { merge: true }
        //     // );
        //   } catch (e) {
        //     console.warn("something went wrong while saving usersettings", e);
        //   }
        // }
        // dispatch(action);
      },
    [
      // userAuth?.uid,
      // dispatch,
      // userDocumentData?.userSettings,
      // userSettingsFromRedux,
    ]
  );
  const dispactionUserSettings = React.useCallback(
    function <A extends any[], P>(actionCreator: (...args: A) => Action<P>) {
      // @ts-ignore
      return (...args: A) => dispatchUserSettings(actionCreator(...args));
    },
    [dispatchUserSettings]
  );

  const userData = React.useMemo((): UserData => {
    // const usedUserSettings =
    //   userAuth?.uid && userDocumentData?.userSettings
    //     ? ensureUserSettings(userDocumentData?.userSettings)
    //     : userSettingsFromRedux;
    const usedUserSettings = userSettingsFromRedux;
    return {
      id: userAuth?.uid || "",
      emailAddress: userAuth?.email || "",
      // profile: userAuth?.uid
      //   ? ensureUserProfile(userDocumentData?.profile || {})
      //   : defaultUserData.profile,
      profile: defaultUserData.profile,
      userSettings: {
        ...usedUserSettings,
        // inputMethodResolved: usedUserSettings.inputMethod !== INPUT_METHODS.DEFAULT
        //   ? usedUserSettings.inputMethod
        //   : userSettingsFromRedux.layout === LAYOUT_OPTIONS.SIDE_BY_SIDE
        //   ? INPUT_METHODS.INLINE
        //   : INPUT_METHODS.STACKED,
        inputMethod: usedUserSettings.inputMethod,
        // inputMethodMobileResolved: usedUserSettings.inputMethodMobile === INPUT_METHODS.DEFAULT ?
        //   INPUT_METHODS.INLINE : usedUserSettings.inputMethodMobile,
        inputMethodMobile: usedUserSettings.inputMethodMobile,
        layout: userSettingsFromRedux.layout,
        ftuxStage: userSettingsFromRedux.ftuxStage,
        chainColumns: userSettingsFromRedux.chainColumns,
        ...(userSettingsFromRedux.hasAcceptedCookies
          ? { hasAcceptedCookies: userSettingsFromRedux.hasAcceptedCookies }
          : {}),
        ...(userSettingsFromRedux.hasAcceptedTNC
          ? { hasAcceptedTNC: userSettingsFromRedux.hasAcceptedTNC }
          : {}),
        // ...(userSettingsFromRedux.oldCalcSyncStatus
        //   ? { oldCalcSyncStatus: userSettingsFromRedux.oldCalcSyncStatus }
        //   : {}),
      },
      profileLoaded: false, //!!(userAuth?.uid && userDocumentData?.userSettings),
    };
  }, [userSettingsFromRedux, userAuth?.uid, userAuth?.email]);

  return (
    <SessionContext.Provider
      value={{
        userData,
        authStatus,
        userHasRegistered: !isAnon,
        // onLogin,
        // onRegister,
        // onLogout,
        dispatchUserSettings,
        dispactionUserSettings,
        setSessionCalculations,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
