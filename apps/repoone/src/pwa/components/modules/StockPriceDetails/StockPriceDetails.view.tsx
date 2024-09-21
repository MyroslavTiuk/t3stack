import React from "react";
import Box from "../../primitives/Box";
import css from "../StrategyCalculator/StockLeg/StockLeg.module.scss";
import T from "../../primitives/Typo";
import formatPrice from "../../../../utils/String/formatPrice/formatPrice";
import { type StockData } from "opc-types/lib/StockData";
import { type Optional } from "opc-types/lib/util/Optional";

type StockPriceDetailsProps = {
  prices: Omit<StockData, "ivHist">;
  lastRetrieved: Optional<number>;
  chainAvailable: boolean;
  outOfDate: boolean;
  refreshPrices: () => void;
  priceOnChange: (n: string) => void;
};
export const StockPriceDetails = (props: StockPriceDetailsProps) => {
  const setPrice = (n: number) => props.priceOnChange(n.toFixed(2));

  return (
    <Box flex>
      <Box
        onClick={() => props.prices?.last && setPrice(props.prices.last)}
        flex-col
        className={[
          css.priceGroup,
          !!props.prices?.last && css["--clickable"],
          "flex flex-col",
        ]}
      >
        <T className={css._priceNum}>
          {props.prices?.last ? formatPrice(props.prices.last) : <>–</>}
        </T>
        <T className={[css._priceLabel]}>Last</T>
      </Box>
      <Box
        onClick={() => props.prices?.bid && setPrice(props.prices.bid)}
        flex-col
        className={[
          css.priceGroup,
          !!props.prices?.bid && css["--clickable"],
          "flex flex-col",
        ]}
      >
        <T className={css._priceNum}>
          {props.prices?.bid ? formatPrice(props.prices.bid) : <>–</>}
        </T>
        <T className={[css._priceLabel]}>Bid</T>
      </Box>
      <Box
        onClick={() => props.prices?.ask && setPrice(props.prices.ask)}
        flex-col
        className={[
          css.priceGroup,
          !!props.prices?.ask && css["--clickable"],
          "flex flex-col",
        ]}
      >
        <T className={css._priceNum}>
          {props.prices?.ask ? formatPrice(props.prices.ask) : <>–</>}
        </T>
        <T className={[css._priceLabel]}>Ask</T>
      </Box>
    </Box>
  );
};
