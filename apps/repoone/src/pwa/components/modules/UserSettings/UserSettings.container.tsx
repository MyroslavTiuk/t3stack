import React, { useState } from 'react';
import Box from '../../primitives/Box';
import T from '../../primitives/Typo';
import UpdateAccountSettingsContainer from './UpdateAccountSettings.container';
import UpdateCalculatorSettingsContainer from './UpdateCalculatorSettings.container';
import css from './UserSettings.module.scss';
import { UserSettingsTabOptions } from './UserSettings.types';

interface UserSettingsModalProps {
  initialActiveTab: UserSettingsTabOptions;
}
export default function UserSettingsContainer({
  initialActiveTab = UserSettingsTabOptions.Account,
}: UserSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<UserSettingsTabOptions>(
    initialActiveTab,
  );

  const isAccount = activeTab === UserSettingsTabOptions.Account;
  const isCalculator = activeTab === UserSettingsTabOptions.Calculator;
  return (
    <Box flex flex-1 className={css.container}>
      <Box className={css._tabs} pv={1}>
        <Box
          className={[css._options]}
          onClick={() => setActiveTab(UserSettingsTabOptions.Account)}
        >
          <T
            h5
            className={[css._optionText, isAccount && css['--active']]}
            no-weight={!isAccount}
          >
            {UserSettingsTabOptions.Account}
          </T>
        </Box>
        <Box
          onClick={() => setActiveTab(UserSettingsTabOptions.Calculator)}
          className={[css._options]}
        >
          <T
            h5
            className={[css._optionText, isCalculator && css['--active']]}
            no-weight={!isCalculator}
          >
            {UserSettingsTabOptions.Calculator}
          </T>
        </Box>
      </Box>
      <Box className={css._tabsCtnr} mv={1}>
        {isAccount ? (
          <Box className={[css._tabContent]}>
            <UpdateAccountSettingsContainer />
          </Box>
        ) : (
          <Box className={[css._tabContent, css['--id-calculator']]}>
            <UpdateCalculatorSettingsContainer />
          </Box>
        )}
      </Box>
    </Box>
  );
}
