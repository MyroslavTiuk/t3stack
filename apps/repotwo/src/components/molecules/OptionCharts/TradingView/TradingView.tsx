import React, { memo } from "react";
import { Box, useColorMode } from "@chakra-ui/react";

import {
  SymbolInfo,
  FundamentalData,
  SymbolOverview,
} from "react-ts-tradingview-widgets";

type Props = {
  symbol: string;
};

const TradingViewChart: React.FC<Props> = ({ symbol }) => {
  const { colorMode } = useColorMode();

  return (
    <Box w="100%" minH="1000px" h="100%">
      <SymbolInfo
        symbol={symbol}
        colorTheme={colorMode}
        copyrightStyles={{ parent: { display: "none" } }}
        width="100%"
      />
      <SymbolOverview
        symbols={[[symbol]]}
        colorTheme={colorMode}
        copyrightStyles={{ parent: { display: "none" } }}
        width="100%"
        dateFormat="dd MMM 'yy"
      />
      <FundamentalData
        symbol={symbol}
        colorTheme={colorMode}
        copyrightStyles={{ parent: { display: "none" } }}
        width="100%"
      />
    </Box>
  );
};

const TradingView = memo(TradingViewChart);
TradingView.displayName = "TradingView";

export default TradingView;
