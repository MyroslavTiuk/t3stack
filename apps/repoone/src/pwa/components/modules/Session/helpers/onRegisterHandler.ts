// @ts-nocheck

import type React from "react";
import firebase from "firebase/app";
import "firebase/auth";

import { type UserSettings } from "opc-types/lib/UserSettings";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Calculations } from "opc-types/lib/Calculations";

import reduxCalcToFirebaseCalc from "../../../../../services/UserData/reduxCalcToFirebaseCalc";
import StrategyDefault from "../../../../../consts/STRATEGY";
import { CalculationStatus } from "../../../../../services/UserData/CalculationsProvider";
import reportClientError from "../../../../../services/Sentry/reportClientError";
import {
  db,
  registerAnonUser,
  registerWithFirebase,
} from "../../../../../services/Firebase";
import {
  CalculationsCollection,
  UsersCollection,
} from "../../../../../services/Firebase/firestoreCollections";

import {
  AUTH_STATUS,
  type Profile,
  REGISTRATION_ERRORS,
  type RegistrationParams,
} from "../Session.types";

type Deps = [
  React.Dispatch<React.SetStateAction<AUTH_STATUS>>,
  React.Dispatch<React.SetStateAction<Nullable<firebase.User>>>,
  UserSettings,
  Calculations,
  () => void
];

const REGISTRATION_ERROR_MAP: ObjRecord<REGISTRATION_ERRORS> = {
  "auth/email-already-in-use": REGISTRATION_ERRORS.EMAIL_ALREADY_USED,
  "auth/invalid-email": REGISTRATION_ERRORS.INVALID_EMAIL,
  "auth/weak-password": REGISTRATION_ERRORS.WEAK_PASSWORD,
};

const { Timestamp } = firebase.firestore;

export const postAuthProcess = async (
  user: firebase.User,
  deps: Deps,
  profile: Profile
) => {
  const [setAuthStatus, setUserAuth, userSettingsFromRedux, calcs, onSuccess] =
    deps;
  const newUserData = user;
  // Note: Hack, it doesn't save if I don't wait a bit
  setTimeout(async () => {
    try {
      if (newUserData?.uid) {
        const batch = db.batch();
        calcs.forEach((calc) => {
          const firebaseCalculation = reduxCalcToFirebaseCalc(calc);
          batch.set(CalculationsCollection.doc(calc.id || undefined), {
            dateUpdated: Timestamp.now(),
            calculation: firebaseCalculation,
            strategyVersion: StrategyDefault.version,
            userId: newUserData.uid,
            status: CalculationStatus.ACTIVE,
          });
        });
        await Promise.all([
          UsersCollection.doc(newUserData?.uid).set(
            {
              profile,
              userSettings: userSettingsFromRedux,
            },
            {}
          ),
          batch.commit(),
        ]);
      }
    } catch (e) {
      console.error("error in postAuthProcess", e);
    }
    setUserAuth(newUserData);
    setAuthStatus(AUTH_STATUS.STATE_AUTHED);

    onSuccess();
  }, 1000);
  return {};
};

const onRegisterHandler = async (deps: Deps, params: [RegistrationParams]) => {
  const [setAuthStatus] = deps;
  const [{ emailAddress, password, firstName, emailUpdates }] = params;
  try {
    setAuthStatus(AUTH_STATUS.STATE_LOADING);
    const fbAuth = firebase.auth();
    const newUser = await (fbAuth.currentUser?.uid
      ? Promise.resolve()
          .then(() => registerAnonUser(emailAddress, password))
          .then((c) => fbAuth.currentUser?.linkWithCredential(c))
      : registerWithFirebase(emailAddress, password));
    if (!newUser || !newUser.user) throw Error("Error registering user");

    const profile = {
      firstName,
      emailUpdates,
    };
    return postAuthProcess(newUser.user, deps, profile);
  } catch (e) {
    const error: any = e;
    setAuthStatus(AUTH_STATUS.STATE_ANON);

    const errorCode =
      REGISTRATION_ERROR_MAP[error.code] || REGISTRATION_ERRORS.GENERIC_ERROR;

    console.warn("Issue registering", error);
    if (errorCode == REGISTRATION_ERRORS.GENERIC_ERROR)
      reportClientError({
        category: "AUTH",
        id: "Registration failure",
        data: error,
      });

    return { errorCode };
  }
};

export default onRegisterHandler;
