import React, { useCallback } from 'react';

import userSettingsActions from '../../../store/actions/userSettings';
import Link from '../../primitives/Link';
import ROUTE_PATHS from '../../../../consts/ROUTE_PATHS';
import Box from '../../primitives/Box';
import Button from '../../primitives/Button';
import T from '../../primitives/Typo';

import css from './AcceptCookies.module.scss';
import { useSession } from '../Session/SessionProvider';

export default function AcceptCookies() {
  const { dispactionUserSettings, userData } = useSession();

  const setUserSettings = dispactionUserSettings(
    userSettingsActions.setUserSettings,
  );
  const onAcceptButton = useCallback(() => {
    setUserSettings({
      ...userData?.userSettings,
      hasAcceptedCookies: true,
      hasAcceptedTNC: true,
    });
  }, [setUserSettings, userData?.userSettings]);

  return (
    <Box className={css.container} flexPri={'center'}>
      <Box className={css._content}>
        <Box className={css._textContainer} flexPri="space-between">
          <T content>
            By continuing to use this website or clicking 'Ok', you consent to
            the use of cookies and accept our{' '}
            <Link to={ROUTE_PATHS.PRIVACY_POLICY}>privacy policy</Link> and{' '}
            <Link to={ROUTE_PATHS.TERMS_AND_CONDITIONS}>
              terms and conditions
            </Link>
            .
          </T>
        </Box>
        <Button
          className={css._acceptButton}
          onClick={onAcceptButton}
          secondary
        >
          Ok
        </Button>
      </Box>
    </Box>
  );
}
