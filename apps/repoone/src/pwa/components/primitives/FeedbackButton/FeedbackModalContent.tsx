import React from 'react';
import css from './Feedback.module.scss';
import T from '../Typo';
import { FeedBackForm } from '../../modules/FeedbackForm/FeedbackForm';

export default function FeedbackModalContent() {
  return (
    <div className={css.feedbackModal}>
      <T h2 tagName="h1" mb={1}>
        Give Feedback
      </T>
      <T content mb={3}>
        Let us know if you've had any issues with the new interface or
        calculations estimates
      </T>
      <FeedBackForm formType="beta-feedback" />
    </div>
  );
}
