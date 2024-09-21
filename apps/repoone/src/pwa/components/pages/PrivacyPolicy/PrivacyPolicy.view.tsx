import { type FC, type ReactElement } from "react";
import React from "react";

import MainLayout from "../../layouts/MainLayout";
import T from "../../primitives/Typo";
import Box from "../../primitives/Box";

import commonCss from "../common.module.scss";
import { type PrivacyPolicyProps } from "./PrivacyPolicy.props";

const PrivacyPolicyView: FC<PrivacyPolicyProps> = (
  _props
): ReactElement<"div"> => {
  return (
    <MainLayout
      nestedCard
      title="Privacy Policy - Options profit calculator"
      initialPageTitle="Privacy Policy"
    >
      <Box className={[commonCss.textContent, "formatted-content"]}>
        <T h2 tagName="h1" className="hide-mob">
          Privacy Policy
        </T>
        <T content>
          The calculations you make on Options Profit Calculator are stored
          anonymously and the details of the calculation may be aggregated and
          shared with third parties.
        </T>
        <T content>
          Where you provide contact details to us, we store this information on
          a secure server, and may contact you if we need to let you know about
          security issues with the site. With your consent only, we may also let
          you know about major updates to the software. (Not too regularly, we
          hate spam too.)
        </T>
        <T content>
          Options Profit Calculator uses a third party technology called Ezoic
          to manage advertising. The Ezoic service collects and stores some
          details about you. The privacy policy between Options Profit
          Calculator and Ezoic service can be{" "}
          <a
            href="https://g.ezoic.net/privacy/optionsprofitcalculator.com"
            target="_blank"
          >
            accessed here
          </a>
          .
        </T>
        <T h3>Summary of Requests</T>
        <T content>
          If you'd like to see a summary of the requests to know user
          information, requests to delete user information and requests to
          opt-out of ccpa compliance that this business has received:
        </T>
        <T content>
          <a
            href="https://g.ezoic.net/privacy/optionsprofitcalculator.com/annualRequestSummary"
            target="_blank"
          >
            https://g.ezoic.net/privacy/optionsprofitcalculator.com/annualRequestSummary
          </a>
        </T>
      </Box>
    </MainLayout>
  );
};

export default PrivacyPolicyView;
