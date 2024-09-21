import { useCallback, useEffect, useMemo, useState } from "react";
import validator from "validator";
import {
  AUTH_STATUS,
  // LOGIN_ERRORS,
  type LoginRegistrationParams,
} from "./Session.types";
import { useSession } from "./SessionProvider";
// import { useToastNotification } from "../../primitives/ToastNotification/ToastNotificationProvider";
import { useModalContext } from "../../primitives/Modal/ModalProvider";
import useDispaction from "../../../../utils/Redux/useDispaction";
import analyticsActions from "../../../store/actions/analytics";

import ForgotPasswordContainer from "./ForgotPasswordContainer";
import LoginRegistrationContainer, {
  LoginRegistrationTabOptions,
} from "./LoginRegistration.container";

export default function useLogin({
  onLoginSuccess,
  prefillEmail,
}: {
  onLoginSuccess?: () => void;
  prefillEmail?: string;
}) {
  const [loginForm, setLoginForm] = useState<LoginRegistrationParams>({
    emailAddress: prefillEmail || "",
    password: "",
  });

  const { authStatus } = useSession();
  const [formError, setFormErrors] = useState({
    emailAddress: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  // const { addSuccessNotification, addErrorNotification } =
  //   useToastNotification();
  const onChangeInput = useCallback(
    (field: string, value: string) => {
      setLoginForm({
        ...loginForm,
        [field]: value,
      });
    },
    [setLoginForm, loginForm]
  );

  const isEmailValid = useMemo(
    () => validator.isEmail(loginForm.emailAddress),
    [loginForm]
  );

  const isPasswordValid = useMemo(
    () => Boolean(loginForm.password),
    [loginForm]
  );

  const trackLogin = useDispaction(analyticsActions.login);
  const onLoginClicked = useCallback(async () => {
    if (authStatus === AUTH_STATUS.STATE_LOADING) {
      return;
    }
    if (!isEmailValid || !isPasswordValid) {
      setFormErrors({
        emailAddress: !isEmailValid,
        password: !isPasswordValid,
      });
      return;
    }

    try {
      setErrorMessage("");
      // const { emailAddress, password } = loginForm;
      // const results = await onLogin({
      //   emailAddress,
      //   password,
      // });

      // if (results?.errorCode) {
      //   switch (results.errorCode) {
      //     case LOGIN_ERRORS.EMAIL_ADDRESS_DOESNT_EXISTS:
      //       setErrorMessage("Email address is not yet registered");
      //       break;
      //     case LOGIN_ERRORS.INVALID_CREDENTIALS:
      //       setErrorMessage("Invalid Credentials");
      //       break;
      //     default:
      //       setErrorMessage("We had trouble logging you in, Please try again.");
      //       break;
      //   }
      //   return;
      // }

      trackLogin();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (e) {
      setErrorMessage("We had trouble logging you in, Please try again.");
    }
  }, [
    // onLogin,
    // loginForm,
    setErrorMessage,
    onLoginSuccess,
    setFormErrors,
    authStatus,
    isEmailValid,
    isPasswordValid,
    trackLogin,
  ]);

  useEffect(() => {
    setErrorMessage("");
    setFormErrors({
      emailAddress: false,
      password: false,
    });
  }, [loginForm]);

  const { showModal, hideModal } = useModalContext();
  const onCloseForgotPassword = useCallback(() => {
    showModal({
      // eslint-disable-next-line react/display-name
      content: () => (
        <LoginRegistrationContainer
          initialActiveTab={LoginRegistrationTabOptions.Login}
          onLoginSuccess={hideModal}
        />
      ),
    });
  }, [showModal]);

  const onForgotPasswordClicked = useCallback(() => {
    showModal({
      content: () => (
        <ForgotPasswordContainer defaultEmail={loginForm.emailAddress} />
      ),
      onCloseModal: onCloseForgotPassword,
      headerString: "Reset Password",
    });
  }, [showModal, loginForm.emailAddress]);

  return {
    onChangeInput,
    formError,
    onLoginClicked,
    isLoading: authStatus === AUTH_STATUS.STATE_LOADING,
    errorMessage,
    loginForm,
    onForgotPasswordClicked,
  };
}
