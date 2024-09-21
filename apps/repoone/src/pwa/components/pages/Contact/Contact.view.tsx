import React, { type FC, type ReactElement } from "react";

import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import MainLayout from "../../layouts/MainLayout";
import T from "../../primitives/Typo";
import Link from "../../primitives/Link/Link.view";
import { FeedBackForm } from "../../modules/FeedbackForm/FeedbackForm";

import { type ContactProps } from "./Contact.props";

const ContactView: FC<ContactProps> = (_props): ReactElement<"div"> => {
  return (
    <MainLayout
      nestedCard
      title="Contact us – Options profit calculator"
      initialPageTitle="Contact"
    >
      <T h2 tagName="h1" className="hide-mob">
        Contact us
      </T>
      <T content>
        Check out <Link to={ROUTE_PATHS.HELP}>our help section</Link> to see if
        there's already an answer to your question.
      </T>
      <T content mb={2}>
        Or send us a message below and we'll get back to you as soon as we can.
      </T>
      <FeedBackForm formType={"contact"} />
    </MainLayout>
  );
};

export default ContactView;
