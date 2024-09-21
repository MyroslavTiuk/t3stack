import React, { useCallback } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import css from './Feedback.module.scss';
import T from '../Typo';
import { useModalContext } from '../Modal/ModalProvider';

import FeedbackModalContent from './FeedbackModalContent';
import Box from '../Box';

function FeedbackButton() {
  const { showModal } = useModalContext();

  const onButtonClick = useCallback(() => {
    showModal({
      // eslint-disable-next-line react/display-name
      content: () => <FeedbackModalContent />,
    });
  }, [showModal]);
  return (
    <Box className={css.feedbackMask}>
      <Box className={css._inner}>
        <Button
          onClick={onButtonClick}
          no-color
          className={css.feedbackButton}
          childrenClassName={css._buttonChildrenContainer}
        >
          <T className={css._text}>Feedback</T>
          <Icon icon="feedback" ctnrClassName={css._icon} small />
        </Button>
      </Box>
    </Box>
  );
}

export default React.memo(FeedbackButton);
