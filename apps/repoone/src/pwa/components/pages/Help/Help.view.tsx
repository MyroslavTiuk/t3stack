import { type FC, type ReactElement, useEffect, useState } from "react";
import React from "react";
import { type HelpProps } from "./Help.props";

const HelpView: FC<HelpProps> = (_props: HelpProps): ReactElement<"div"> => {
  const [, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="m-auto max-w-2xl">
        <div className="py-20">
          <h1 className="pb-10 text-center text-4xl font-bold">
            Help and Support
          </h1>
          <h3 className="pb-4 text-2xl font-bold">
            How do I use this calculator?
          </h3>
          <p className="pb-4">
            Please view the 5-minute tutorial on how to make a basic
            calculation.
          </p>
          <div className="pb-4">
            <iframe
              width="640"
              height="360"
              src="https://www.youtube.com/embed/Pzo0SsQxku4"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <h3 className="py-4 text-xl font-bold">
            What formula is used for estimates?
          </h3>
          <p className="pb-4">
            The website uses the Black-Scholes formula to estimate returns at a
            range of dates and potential underlying prices. The estimations are
            based on implied volatility which is calculated from the current
            price of the selected options and the current price of the
            underlying stock or ETF.
          </p>
          <p className="pb-4">
            For strategies employing multiple options, the estimated price of
            each option is calculated individually and combined to give gross
            profit or loss. The overall P/L for any given point in time and
            price is the exit value less the total entry value, which is
            calculated using the prices you enter or select.
          </p>
          <p className="pb-4" id="limitations-section">
            The exception is for the first day where, if you have made the
            calculation after market open, the estimates are from the time the
            calculation is made, rather than opening time.
          </p>
          <h3 className="pb-4 text-xl font-bold">
            What are the limitations of the calculator?
          </h3>
          <ul className="pb-4">
            <li>
              The largest unknown in the Black-Scholes formula, and any other
              pricing method, is Implied Volatility. Given a constant IV, the
              calculator will be correct in its price estimation, however since
              IV is a reflection of market sentiment and external variables, it
              is impossible to predict what people will be thinking in the
              future.
            </li>
            <li>
              'Slippage' due to entering and exiting the trade based on bid/ask
              spread is not taken into consideration. The purchase price you
              enter is used to calculate the implied volatility, as this is the
              agreed value of the option at the time of the trade. The
              calculated value of each option is not altered based on the
              current bid/ask spread.
            </li>
            <li>
              Any brokerage fees you may incur are not included in the
              calculation.
            </li>
          </ul>
          <h3 className="pb-4 text-xl font-bold">
            Where does the pricing information come from?
          </h3>
          <p className="pb-4">
            Stock and Options prices are sourced from reputable third party
            websites. Prices are delayed between 15-30 minutes.
          </p>
          <p className="pb-4">
            We will be adding the feature download a spreadsheet of your
            calculation estimates, allowing you to manage your history of
            calculations and organize your trades.
          </p>
          <h3 className="pb-4 text-xl font-bold">
            I lost money on a trade and your calculator said I would make a
            profit.
          </h3>
          <p className="pb-4">
            Please read the{" "}
            <a href="#limitations-section" className="underline">
              limitations of calculator
            </a>{" "}
            as above. The most common reason for this is that the company
            released a statement or an earnings report, and there was a drastic
            and sudden change in the implied volatility.
          </p>
          <h3 className="pb-4 text-xl font-bold">
            What time of day are the daily estimates for?
          </h3>
          <p>
            Estimates are for market open time on the day listed. This allows
            there to be an estimate on the day of expiry where there is still
            time value remaining, as well as the last column ('exp') which is at
            market close on expiry day. (For diagonal / calendar spreads, 'back
            months' option legs will still have time value remaining.)
          </p>
        </div>
      </div>
    </>
  );
};

export default HelpView;
