import React, { useRef } from "react";
// @ts-ignore
import { AssetType, type Trade } from "trackgreeks-database";
import TradeList from "../log/TradeList";
import TimeRangeSelector from "../atoms/TimeRangeSelector";
import { sub } from "date-fns";
import { debounce } from "lodash";

const AddTrade: React.FC<Props> = ({ onSelect }) => {
  const [startDate, setStartDate] = React.useState<Date>(
    sub(new Date(), { days: 7 })
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [symbol, setSymbol] = React.useState<string | undefined>(undefined);
  const [assetType, setAssetType] = React.useState<AssetType>(AssetType.Option);

  const debouncedSetSymbol = useRef(
    debounce(
      (event: React.ChangeEvent<HTMLInputElement>) =>
        setSymbol(event.target.value ? event.target.value : undefined),
      400
    )
  ).current;

  const onChangeSymbol = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    debouncedSetSymbol(event);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="symbol" className="text-neutral-700">
            Symbol
          </label>
          <input
            id="symbol"
            type="text"
            placeholder="e.g. AAPL"
            className="rounded-md"
            onChange={onChangeSymbol}
          />
        </div>

        <fieldset className="flex flex-col justify-center">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id={AssetType.Equity}
                name={AssetType.Equity}
                value={AssetType.Equity}
                type="radio"
                checked={assetType === AssetType.Equity}
                className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-600"
                onChange={() => setAssetType(AssetType.Equity)}
              />
              <label
                htmlFor={AssetType.Equity}
                className="ml-3 block text-sm font-medium leading-6 text-neutral-700"
              >
                Stocks
              </label>
            </div>
            <div className="flex items-center">
              <input
                id={AssetType.Option}
                name={AssetType.Option}
                value={AssetType.Option}
                type="radio"
                checked={assetType === AssetType.Option}
                className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-600"
                onChange={() => setAssetType(AssetType.Option)}
              />
              <label
                htmlFor={AssetType.Option}
                className="ml-3 block text-sm font-medium leading-6 text-neutral-700"
              >
                Options
              </label>
            </div>
          </div>
        </fieldset>
        <div className="flex flex-col gap-1">
          <p>Time range</p>
          <TimeRangeSelector
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>
      <div className="max-w-md">
        <TradeList
          assetType={assetType}
          startDate={startDate}
          endDate={endDate}
          symbol={symbol}
          onSelect={onSelect}
        />
      </div>
    </>
  );
};

type Props = {
  onSelect: (trade: Trade) => void;
};

export default AddTrade;
