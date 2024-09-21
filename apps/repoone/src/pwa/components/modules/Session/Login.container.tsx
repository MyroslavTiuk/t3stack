import React from "react";
import Box from "../../primitives/Box";
import Button from "../../primitives/Button";
import Input from "../../primitives/Input";
import T from "../../primitives/Typo";
import css from "./Session.module.scss";
import { type LoginRegistrationViewProps } from "./Session.types";
import useLogin from "./useLogin";

export default function Login({
  headerText,
  onLoginSuccess,
  onCancel,
  prefillEmail,
}: LoginRegistrationViewProps) {
  const {
    formError,
    onLoginClicked,
    onChangeInput,
    isLoading,
    errorMessage,
    loginForm,
    onForgotPasswordClicked,
  } = useLogin({
    onLoginSuccess,
    prefillEmail,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Box>
        {headerText && (
          <T mb={3} content-pragmatic>
            {headerText}
          </T>
        )}
        <Box mb={2} className={css.inputsContainer}>
          <T content-field-label>Email:</T>
          <Input
            type="email"
            spellCheck={false}
            value={loginForm.emailAddress}
            onChange={(value) => onChangeInput("emailAddress", value)}
            error={formError.emailAddress ? "Invalid Email Format" : undefined}
            noTrack
          />
        </Box>
        <Box mb={2} className={css.inputsContainer}>
          <T content-field-label>Password:</T>
          <Input
            onChange={(value: string) => onChangeInput("password", value)}
            spellCheck={false}
            autoComplete={"off"}
            type="password"
            error={formError.password ? "Password is required" : undefined}
            noTrack
          />
        </Box>
        {errorMessage && <T className={css.textErrors}>{errorMessage}</T>}
        <Button
          secondary
          onClick={onLoginClicked}
          loading={isLoading}
          type="submit"
        >
          Login
        </Button>
        <Box className={css.forgotPasswordContainer} mt={1}>
          <T
            tagName={"a"}
            onClick={onForgotPasswordClicked}
            clickable
            content-pragmatic
          >
            Forgot Password?
          </T>
        </Box>

        {onCancel && (
          <Button
            outline
            secondary
            onClick={onCancel}
            disabled={isLoading}
            className={css.cancel}
            type="submit"
          >
            Cancel
          </Button>
        )}
      </Box>
    </form>
  );
}
