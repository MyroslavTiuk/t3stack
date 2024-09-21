import { useCallback, useEffect, useMemo, useState } from "react";
import validator from "validator";
import analyticsActions from "../../../store/actions/analytics";
import useDispaction from "../../../../utils/Redux/useDispaction";
import { SITE } from "../../../../config/Site";

import {
  AUTH_STATUS,
  type LoginRegistrationParams,
  REGISTRATION_ERRORS,
} from "./Session.types";
import { useSession } from "./SessionProvider";

interface RegistrationFormParams extends LoginRegistrationParams {
  firstName: string;
}
export default function useRegister({
  onLoginSuccess,
}: {
  onLoginSuccess?: () => void;
}) {
  // @ts-ignore
  const { onRegister, authStatus } = useSession();
  const [hasError, setHasError] = useState(false);
  const [receiveEmailUpdates, setReceiveEmailUpdaes] = useState(false);

  const [registrationForm, setRegistrationForm] =
    useState<RegistrationFormParams>({
      emailAddress: "",
      password: "",
      firstName: "",
    });

  const [formErrors, setFormErrors] = useState({
    emailAddress: "",
    password: "",
    firstName: "",
  });

  const onChangeInput = useCallback(
    (field: string, value: string) => {
      setRegistrationForm({
        ...registrationForm,
        [field]: value,
      });
    },
    [setRegistrationForm, registrationForm]
  );

  const isPasswordValid = useMemo(() => {
    return SITE.PASSWORD_REQUIREMENT_REGEX.test(registrationForm.password);
  }, [registrationForm]);

  const isEmailValid = useMemo(
    () => validator.isEmail(registrationForm.emailAddress),
    [registrationForm]
  );

  const isFirstNameValid = useMemo(
    () => Boolean(registrationForm.firstName),
    [registrationForm]
  );

  const trackSignUp = useDispaction(analyticsActions.signUp);
  const onRegistraterClicked = useCallback(async () => {
    if (authStatus === AUTH_STATUS.STATE_LOADING) {
      return;
    }
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
      setHasError(false);

      const { emailAddress, password, firstName } = registrationForm;
      const results = await onRegister({
        emailAddress,
        password,
        firstName,
        emailUpdates: receiveEmailUpdates,
      });

      if (results?.errorCode) {
        switch (results?.errorCode) {
          case REGISTRATION_ERRORS.EMAIL_ALREADY_USED:
            setFormErrors({
              emailAddress: "Email has already been registered",
              password: "",
              firstName: "",
            });
            break;
          case REGISTRATION_ERRORS.INVALID_EMAIL:
            setFormErrors({
              emailAddress: "Invalid email format",
              password: "",
              firstName: "",
            });
            break;
          case REGISTRATION_ERRORS.WEAK_PASSWORD:
            setFormErrors({
              emailAddress: "",
              password:
                "Password must be minimum 8 characters with 1 number and 1 capital",
              firstName: "",
            });
            break;

          default:
            setHasError(true);
            break;
        }

        return;
      }

      trackSignUp();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (e) {
      setHasError(true);
    }
  }, [
    onRegister,
    registrationForm,
    setFormErrors,
    onLoginSuccess,
    authStatus,
    isEmailValid,
    isFirstNameValid,
    isPasswordValid,
    receiveEmailUpdates,
  ]);

  useEffect(() => {
    setFormErrors({
      emailAddress: "",
      password: "",
      firstName: "",
    });
  }, [registrationForm]);

  const onToggleCheckBox = useCallback(() => {
    setReceiveEmailUpdaes((newValue) => !newValue);
  }, []);

  return {
    onRegistraterClicked,
    onChangeInput,
    hasError,
    formErrors,
    authStatus,
    onToggleCheckBox,
    receiveEmailUpdates,
  };
}
