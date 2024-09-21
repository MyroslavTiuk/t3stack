import React from 'react';
import Box from '../../primitives/Box';
import Button from '../../primitives/Button';
import Input from '../../primitives/Input';
import T from '../../primitives/Typo';
import useForgotPassword from './useForgotPassword';
import css from './Session.module.scss';
import { useModalContext } from '../../primitives/Modal/ModalProvider';

export default function ForgotPasswordContainer(props: {
  defaultEmail: string;
}) {
  const {
    setEmail,
    email,
    isEmailValid,
    onResetPasswordClicked,
    loading,
    passwordResetSuccess,
    errorMessage,
  } = useForgotPassword(props.defaultEmail);
  const { hideModal } = useModalContext();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {!passwordResetSuccess ? (
        <>
          <T mb={2} content-pragmatic>
            Enter the email address below and press submit to request password
            reset.
          </T>
          <Box mb={2} className={css.inputsContainer}>
            <T content-field-label>Email:</T>
            <Input
              value={email}
              onChange={(value) => setEmail(value)}
              error={
                Boolean(email) && !isEmailValid
                  ? 'Invalid Email Format'
                  : undefined
              }
              noTrack
            />
          </Box>
          {errorMessage && <T className={css.textErrors}>{errorMessage}</T>}
          <Button
            secondary
            onClick={onResetPasswordClicked}
            loading={loading}
            type="submit"
            disabled={!isEmailValid}
          >
            Reset Password
          </Button>
        </>
      ) : (
        <>
          <T content-pragmatic mv={2}>
            A reset password link has been sent to your email address. Please
            follow the link to set a new password.
          </T>
          <T tagName={'a'} content-pragmatic clickable onClick={hideModal}>
            Back to Login
          </T>
        </>
      )}
    </form>
  );
}
