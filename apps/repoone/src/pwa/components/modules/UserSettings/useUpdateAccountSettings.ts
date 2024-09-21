import firebase from "firebase/app";
import "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import validator from "validator";
import { UsersCollection } from "../../../../services/Firebase/firestoreCollections";
import { useSession } from "../Session/SessionProvider";
import {
  UpdateAccountErrorCodes,
  type UpdateAccountParams,
} from "./UserSettings.types";
import { SITE } from "../../../../config/Site";
import { useToastNotification } from "../../primitives/ToastNotification/ToastNotificationProvider";

export default function useUpdateAccountSettings() {
  const { userData } = useSession();
  const { profile } = userData;
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState<UpdateAccountParams>({
    firstName: profile?.firstName || "",
    emailAddress: userData.emailAddress,
    password: "",
    emailUpdates: profile?.emailUpdates || false,
  });

  const { addSuccessNotification } = useToastNotification();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formErrors, setFormErrors] = useState({
    emailAddress: "",
    password: "",
    firstName: "",
  });

  const isPasswordValid = useMemo(() => {
    if (!formData.password) {
      return true;
    }
    return SITE.PASSWORD_REQUIREMENT_REGEX.test(formData.password);
  }, [formData]);

  const isEmailValid = useMemo(
    () => validator.isEmail(formData?.emailAddress || ""),
    [formData]
  );

  const isFirstNameValid = useMemo(
    () => Boolean(formData?.firstName),
    [formData]
  );

  const onChangeInput = useCallback(
    (field: string, value: string | boolean) => {
      setFormData({
        ...formData,
        [field]: value,
      });
    },
    [formData]
  );

  const onSaveChanges = useCallback(async () => {
    if (!isPasswordValid || !isEmailValid || !isFirstNameValid) {
      setFormErrors({
        emailAddress: !isEmailValid ? "Invalid email format" : "",
        password: !isPasswordValid
          ? "Password must be minimum 8 characters with 1 number and 1 capital"
          : "",
        firstName: !isFirstNameValid ? "First Name is required" : "",
      });

      return;
    }

    try {
      setLoading(true);
      // @ts-ignore
      const authUser = firebase.auth().currentUser;
      if (formData.emailAddress !== userData.emailAddress) {
        await authUser?.updateEmail(formData.emailAddress);
      }
      if (formData.password) {
        await authUser?.updatePassword(formData.password);
      }

      if (
        formData.firstName !== profile.firstName ||
        formData.emailUpdates !== profile.emailUpdates
      ) {
        await UsersCollection.doc(userData.id).set(
          {
            profile: {
              firstName: formData.firstName,
              emailUpdates: formData.emailUpdates,
            },
          },
          { merge: true }
        );
      }
      setLoading(false);
      addSuccessNotification("Successfully updated Account Settings");
      setSuccessMessage("Successfully updated Account Settings");
    } catch (err) {
      const e: any = err;
      switch (e.code) {
        case UpdateAccountErrorCodes.EMAIL_ALREADY_USED:
          setErrorMessage("Email already exist");
          break;

        case UpdateAccountErrorCodes.SIGN_IN_REQUIRED:
          setShowLoginForm(true);
          break;

        default:
          setErrorMessage(
            "Something went wrong while trying to update info. Please try again"
          );
          break;
      }

      setLoading(false);
    }
  }, [
    formData,
    userData,
    setShowLoginForm,
    setSuccessMessage,
    setErrorMessage,
    addSuccessNotification,
  ]);

  useEffect(() => {
    setFormErrors({
      emailAddress: "",
      password: "",
      firstName: "",
    });

    setErrorMessage("");
    setSuccessMessage("");
  }, [formData]);

  const formValid = useMemo(() => {
    const emailChanged = formData.emailAddress !== userData.emailAddress;
    const firstNameChanged = formData.firstName !== profile.firstName;
    const emailUpdatesChanged = formData.emailUpdates !== profile.emailUpdates;

    return Boolean(
      emailChanged ||
        firstNameChanged ||
        emailUpdatesChanged ||
        formData.password
    );
  }, [userData, formData]);

  return {
    formData,
    onChangeInput,
    formErrors,
    onSaveChanges,
    loading,
    errorMessage,
    successMessage,
    formValid,
    showLoginForm,
    setShowLoginForm,
    currentEmailAddress: userData.emailAddress,
  };
}
