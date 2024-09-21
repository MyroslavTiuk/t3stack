import React from "react";

import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import clx from "../../../../utils/Html/clx";
import Box from "../../primitives/Box";
import Button from "../../primitives/Button";
import Input from "../../primitives/Input";
import T from "../../primitives/Typo";
import Link from "../../primitives/Link/Link.view";

import css from "./Session.module.scss";
import { AUTH_STATUS, type LoginRegistrationViewProps } from "./Session.types";
import useRegister from "./useRegister";

export default function Register({
  onLoginSuccess,
  headerText,
}: LoginRegistrationViewProps) {
  const {
    onChangeInput,
    onRegistraterClicked,
    hasError,
    formErrors,
    authStatus,
    receiveEmailUpdates,
    onToggleCheckBox,
  } = useRegister({
    onLoginSuccess,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Box>
        <T mb={3} content-pragmatic>
          {headerText ||
            "Keep track of trades in your OPC portfolio and access calculations from all your devices"}
        </T>
        <Box mb={2} className={css.inputsContainer}>
          <T content-field-label>First Name:</T>
          <Input
            onChange={(value: string) => onChangeInput("firstName", value)}
            error={formErrors.firstName || undefined}
          />
        </Box>
        <Box mb={2} className={css.inputsContainer}>
          <T content-field-label>Email:</T>
          <Input
            type="email"
            spellCheck={false}
            onChange={(value: string) => onChangeInput("emailAddress", value)}
            error={formErrors.emailAddress || undefined}
            noTrack
          />
        </Box>
        <Box mb={2} className={css.inputsContainer}>
          <T content-field-label>Password:</T>
          <Input
            onChange={(value: string) => onChangeInput("password", value)}
            type="password"
            spellCheck={false}
            autoComplete={"off"}
            error={formErrors.password || undefined}
            noTrack
          />
        </Box>

        <Box mv={2}>
          <T content-detail tagName="label">
            <input
              type="checkbox"
              defaultChecked={receiveEmailUpdates}
              onChange={onToggleCheckBox}
              className={clx([css.checkbox, "styled"])}
            />{" "}
            I'd like to receive occasional email updates about new features
          </T>
        </Box>

        {hasError && (
          <T className={css.textErrors}>
            We had trouble processing your registration, Please try again.
          </T>
        )}
        <Button
          secondary
          onClick={onRegistraterClicked}
          loading={authStatus === AUTH_STATUS.STATE_LOADING}
          type="submit"
        >
          Register
        </Button>
        <T content-detail mt={2}>
          By clicking the "Register" button, you are creating an Options Profit
          Calculator account and you agree to our{" "}
          <Link to={ROUTE_PATHS.TERMS_AND_CONDITIONS}>
            {/*@ts-ignore*/}
            <p target={"_blank"}>terms of use</p>
          </Link>{" "}
          and{" "}
          <Link to={ROUTE_PATHS.PRIVACY_POLICY}>
            <p>privacy policy</p>
          </Link>
          .
        </T>
      </Box>
    </form>
  );
}
