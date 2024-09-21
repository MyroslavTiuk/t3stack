import firebase from "firebase/app";
import "firebase/auth";
import { useMemo, useState } from "react";
import validator from "validator";
import { useToastNotification } from "../../primitives/ToastNotification/ToastNotificationProvider";
import { getFullUrl } from "../../../../utils/App/url";

const ERROR_MESSAGES = {
  "auth/user-not-found": "Email does not exist",
};
export default function useForgotPassword(defaultEmail: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(defaultEmail || "");

  const isEmailValid = useMemo(() => validator.isEmail(email), [email]);

  const {
    addSuccessNotification,
    // addErrorNotification,
  } = useToastNotification();
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onResetPasswordClicked = async () => {
    if (!isEmailValid) {
      return;
    }
    try {
      setLoading(true);
      // @ts-ignore
      await firebase.auth().sendPasswordResetEmail(email, {
        url: getFullUrl("/"),
        handleCodeInApp: false,
      });
      addSuccessNotification("Successfully submitted password reset request.");
      setPasswordResetSuccess(true);
      setLoading(false);
    } catch (err) {
      const e: any = err;
      if (e.code) {
        const errorMessage =
          // @ts-ignore
          ERROR_MESSAGES[e.code] ||
          "Something went wrong while resetting your password, please try again";
        setErrorMessage(errorMessage);
      }
      setLoading(false);
      setPasswordResetSuccess(false);
    }
  };

  return {
    setEmail,
    email,
    isEmailValid,
    loading,
    onResetPasswordClicked,
    passwordResetSuccess,
    errorMessage,
  };
}
