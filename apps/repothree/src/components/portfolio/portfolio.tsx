import {
  DocumentTextIcon,
  BellAlertIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
// @ts-ignore
import { AssetType } from "trackgreeks-database";
import React from "react";
import OpenTradeList from "./openTradeList";

const Portfolio: React.FC<Props> = ({ portfolioId }) => {
  return (
    <div className="flex w-full justify-center">
      <div className="container flex w-full flex-col items-center gap-4 ">
        <h1 className="text-center text-xl font-bold text-neutral-700">
          Current Portfolio
          <DocumentTextIcon className="ml-2 inline-block h-6 w-6" />
        </h1>
        <div className="flex w-full flex-wrap justify-around">
          <div className="w-[95%] md:w-[48%]">
            <h2 className="mb-2 flex items-center gap-2 text-3xl font-black text-neutral-700">
              <BellAlertIcon className="h-8 w-8" />
              Options
            </h2>
            <OpenTradeList
              assetType={AssetType.Option}
              portfolioId={portfolioId}
            />
          </div>
          <div className="w-[95%] md:w-[48%]">
            <h2 className="mb-2 flex items-center gap-2 text-3xl font-black text-neutral-700">
              <CurrencyDollarIcon className="h-8 w-8" />
              Stocks
            </h2>
            <OpenTradeList
              assetType={AssetType.Equity}
              portfolioId={portfolioId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {
  portfolioId?: string;
};

export default Portfolio;
