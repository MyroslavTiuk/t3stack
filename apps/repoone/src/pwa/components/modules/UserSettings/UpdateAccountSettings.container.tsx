import React, { useCallback } from 'react';

import clx from '../../../../utils/Html/clx';
import Box from '../../primitives/Box';
import Button from '../../primitives/Button';
import GridCols from '../../primitives/GridCols';
import T from '../../primitives/Typo';
import Input from '../../primitives/Input';
import LoginContainer from '../Session/Login.container';

import useUpdateAccountSettings from './useUpdateAccountSettings';
import css from './UserSettings.module.scss';

const RowFields = ({
  onChangeInput,
  error,
  label,
  value,
  type,
}: {
  onChangeInput: (value: string) => void;
  label: string;
  error: string | undefined;
  value: string;
  type?: string;
}) => {
  return (
    <GridCols className={[css.rowField]}>
      <Box className={[css._labelContainer, '_cols-mob-12 _cols-tab-plus-3']}>
        <T content-pragmatic className={css.label}>
          {label}:
        </T>
      </Box>
      <Box className={[css._inputContainer, '_cols-mob-12 _cols-tab-plus-6']}>
        <Input
          onChange={onChangeInput}
          error={error}
          value={value}
          spellCheck={false}
          autoComplete={'off'}
          noTrack
          {...(type ? { type } : {})}
        />
      </Box>
    </GridCols>
  );
};

export default function UpdateAccountSettingsContainer() {
  const {
    formData,
    onChangeInput,
    formErrors,
    loading,
    onSaveChanges,
    formValid,
    showLoginForm,
    setShowLoginForm,
    errorMessage,
    successMessage,
    currentEmailAddress,
  } = useUpdateAccountSettings();

  const onLoginSuccess = useCallback(() => {
    setShowLoginForm(false);
    onSaveChanges();
  }, [setShowLoginForm, onSaveChanges]);
  if (showLoginForm) {
    return (
      <LoginContainer
        prefillEmail={currentEmailAddress}
        onLoginSuccess={onLoginSuccess}
        headerText="In order to update your email/password, we need you to login to verify it's you."
        onCancel={() => setShowLoginForm(false)}
      />
    );
  }

  return (
    <Box className={css.settingsContentContainer}>
      <T h4>Edit your Account Details</T>

      <RowFields
        label="First Name"
        onChangeInput={(value: string) => onChangeInput('firstName', value)}
        error={formErrors.firstName || undefined}
        value={formData.firstName || ''}
      />

      <RowFields
        label="Email"
        onChangeInput={(value: string) => onChangeInput('emailAddress', value)}
        error={formErrors.emailAddress || undefined}
        value={formData.emailAddress || ''}
        type="email"
      />

      <Box className={css._secondarySettings}>
        <T className={css._secondarySettingsLabel}>CHANGE PASSWORD</T>
        <RowFields
          label="Password"
          onChangeInput={(value: string) => onChangeInput('password', value)}
          error={formErrors.password || undefined}
          value={formData.password}
          type="password"
        />
      </Box>

      <Box className={css._secondarySettings}>
        <T className={css._secondarySettingsLabel}>EMAIL UPDATES</T>
        <Box mt={1} mb={2}>
          <T content-detail tagName={'label'}>
            <input
              type="checkbox"
              defaultChecked={formData.emailUpdates}
              onChange={() =>
                onChangeInput('emailUpdates', !formData.emailUpdates)
              }
              className={clx([css._checkbox, 'styled'])}
            />
            I'd like to receive occasional email updates about new features
          </T>
        </Box>
      </Box>

      {errorMessage && <T className={css.textErrors}>{errorMessage}</T>}
      {successMessage && <T className={css.successMessage}>{successMessage}</T>}
      <Button
        loading={loading}
        secondary
        onClick={onSaveChanges}
        disabled={!formValid}
      >
        Save Changes
      </Button>

      <T content-detail-minor mt={2}>
        To delete your account, please contact
        support@optionsprofitcalculator.com
      </T>
    </Box>
  );
}
