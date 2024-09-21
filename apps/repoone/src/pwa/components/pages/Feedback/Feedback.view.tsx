import React, { type FC, type ReactElement } from "react";

import MainLayout from "../../layouts/MainLayout";
import T from "../../primitives/Typo";
import { FeedBackForm } from "../../modules/FeedbackForm/FeedbackForm";

import { type FeedbackProps } from "./Feedback.props";

const FeedbackView: FC<FeedbackProps> = (_props): ReactElement<"div"> => {
  return (
    <MainLayout
      nestedCard
      title="Feedback – Options profit calculator"
      initialPageTitle="Feedback"
    >
      <T h2 tagName="h1" className="hide-mob">
        Provide Feedback
      </T>
      <T content mv={1 / 2}>
        Thank you for taking the time to tell us about your experience on the
        new site.
      </T>
      <T content mb={2}>
        If you had any issues with estimates, the form or interface, or just
        have suggestions on how you'd like things to work, please let us know.
      </T>
      <FeedBackForm formType={"contact"} />
    </MainLayout>
  );
};

export default FeedbackView;
