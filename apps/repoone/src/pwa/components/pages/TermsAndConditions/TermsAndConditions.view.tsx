import { type FC, type ReactElement } from "react";
import React from "react";

import MainLayout from "../../layouts/MainLayout";
import T from "../../primitives/Typo";
import Box from "../../primitives/Box";

import commonCss from "../common.module.scss";
import { type TermsAndConditionsProps } from "./TermsAndConditions.props";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import Link from "../../primitives/Link/Link.view";

const TermsAndConditionsView: FC<TermsAndConditionsProps> = (
  _props
): ReactElement<"div"> => {
  return (
    <MainLayout
      nestedCard
      title="Terms and conditions - Options profit calculator"
      initialPageTitle="Terms and conditions"
    >
      <Box className={[commonCss.textContent, "formatted-content"]}>
        <T h2 tagName="h1" className="hide-mob">
          Terms and Conditions
        </T>
        <T content>
          By using this website you consent that the calculations you make may
          be anonymously published on this website and any other websites, for
          example twitter or facebook. These calculations will be presented in
          an anonymous format. This includes but is not limited to, 'recent
          calculations' and 'popular trades of the week' type posts. The purpose
          of this is to encourage options trading, help promote the website, and
          assist others to recognise valuable techniques.
        </T>
        <T content>
          Details you provide upon site registration are recorded on a secure,
          third party cloud server. Your personal details are only used for
          identifying you when you log in and for contacting you, and will not
          be shared with third parties unless we are required to do so by law.
        </T>
        <T content>
          The information provided on this site is provided as an estimate only
          and makes no claim to be an accurate representation of current or
          future values. It, therefore, does not claim that estimated returns on
          investment and/or estimated prices will be accurate.
        </T>
        <T content>
          This website does not give any investment advice and does not give any
          recommendations as to which trading style you should adopt for your
          own personal use. The publisher of this site is not a licensed
          financial adviser nor investment adviser, and cannot, and will not
          give any financial advise, stock tips, or recommendations. And cannot,
          and will not try to encourage you to trade a certain instrument over
          another.
        </T>
        <T content>
          Your decision to trade, the instruments you trade, and the trading
          method that you employ is yours alone to decide upon. The publisher of
          this site and all those involved or associated with this publication
          expressly disclaim all and any liability to any person or persons
          whether a user of any of our products or not, in respect of anything
          and of the consequences of anything done or omitted to be done by any
          person or persons in reliance, whether whole or partial, upon the
          whole or any part of the contents of this publication.
        </T>
        <T content>
          By accepting these terms and conditions you also are accepting and
          agreeing with our{" "}
          <Link to={ROUTE_PATHS.PRIVACY_POLICY}>Privacy Policy</Link>.
        </T>
      </Box>
    </MainLayout>
  );
};

export default TermsAndConditionsView;
