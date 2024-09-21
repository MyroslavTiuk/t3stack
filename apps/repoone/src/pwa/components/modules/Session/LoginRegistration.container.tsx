import React, { useState } from "react";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import LoginContainer from "./Login.container";
import RegisterContainer from "./Register.container";
import css from "./Session.module.scss";
import { type LoginRegistrationViewProps } from "./Session.types";

export enum LoginRegistrationTabOptions {
  Login = "Login",
  Register = "Register",
}

interface LoginRegistrationContainerProps extends LoginRegistrationViewProps {
  initialActiveTab: LoginRegistrationTabOptions;
}
export default function LoginRegistrationContainer({
  initialActiveTab,
  onLoginSuccess,
  headerText,
}: LoginRegistrationContainerProps) {
  const [activeTab, setActiveTab] =
    useState<LoginRegistrationTabOptions>(initialActiveTab);

  return (
    <Box className={css.container}>
      <Box className={css.headerContainer}>
        <T
          h5
          className={[
            css.headerTab,
            activeTab === LoginRegistrationTabOptions.Login && css.activeTab,
          ]}
          onClick={() => setActiveTab(LoginRegistrationTabOptions.Login)}
          no-weight={activeTab !== LoginRegistrationTabOptions.Login}
        >
          Login
        </T>
        <T
          h5
          className={[
            css.headerTab,
            activeTab === LoginRegistrationTabOptions.Register && css.activeTab,
          ]}
          onClick={() => setActiveTab(LoginRegistrationTabOptions.Register)}
          no-weight={activeTab !== LoginRegistrationTabOptions.Register}
        >
          Register
        </T>
      </Box>
      <Box className={css.contentContainer} style={{ position: "relative" }}>
        <Box
          style={{
            visibility:
              activeTab === LoginRegistrationTabOptions.Login
                ? "visible"
                : "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <LoginContainer
            onLoginSuccess={onLoginSuccess}
            headerText={headerText}
          />
        </Box>
        <Box
          style={{
            visibility:
              activeTab === LoginRegistrationTabOptions.Register
                ? "visible"
                : "hidden",
          }}
        >
          <RegisterContainer
            onLoginSuccess={onLoginSuccess}
            headerText={headerText}
          />
        </Box>
      </Box>
    </Box>
  );
}
