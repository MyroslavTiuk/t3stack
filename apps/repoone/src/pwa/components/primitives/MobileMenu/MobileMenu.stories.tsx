import React from 'react';
import Story from '../Story';
import Box from '../Box';
import MobileMenu from './index';

import css from './MobileMenu.stories.module.scss';

const MobileMenuStory = () => {
  const [openState, setOpenState] = React.useState(false);
  return (
    <Box className="grid">
      <Story title="Basic">
        <MobileMenu
          isExpanded={openState}
          onExpandedUpdated={setOpenState}
          openButtonColor={'#333333'}
        >
          <button className={css.closeBtn} onClick={() => setOpenState(false)}>
            X
          </button>
          <ul className={css.navMenu}>
            <li>Menu options here</li>
            <li>Menu options here</li>
          </ul>
        </MobileMenu>
      </Story>
    </Box>
  );
};

export default MobileMenuStory;
