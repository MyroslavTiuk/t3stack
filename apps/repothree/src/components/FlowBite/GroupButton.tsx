import { OptionAction, OptionType } from "trackgreeks-database";
import React from "react";

type Props = {
  selectedOptions: any;
  setSelectedOptions: (f: any) => void;
  setValue: (t: string, value: any) => void;
};

const GroupButton = ({
  selectedOptions,
  setSelectedOptions,
  setValue,
}: Props) => {
  const handleButtonClick = (button: string, value: string) => {
    setSelectedOptions((prevOptions: any) => ({
      ...prevOptions,
      [button]: value,
    }));
    if (button === "profile") {
      setValue("action", value);
    } else if (button === "call") {
      setValue("optionType", value);
    }
  };
  return (
    <div className="flex max-w-[352px] items-center gap-3">
      <div
        className="inline-flex h-[37px] w-full max-w-[170px] rounded-md shadow-sm"
        role="group"
      >
        <button
          type="button"
          className={`inline-flex items-center rounded-s-lg border border-gray-200 px-8 py-2 text-sm font-medium text-gray-500 ${
            selectedOptions.profile === OptionAction.Buy
              ? "bg-gray-100 text-gray-900 focus:z-10"
              : "bg-white"
          }`}
          onClick={() => handleButtonClick("profile", OptionAction.Buy)}
        >
          Buy
        </button>
        <button
          type="button"
          className={`inline-flex items-center rounded-e-lg border border-gray-200 px-7 py-2 text-sm font-medium text-gray-500 ${
            selectedOptions.profile === OptionAction.Sell
              ? "bg-gray-100 text-gray-900 focus:z-10"
              : "bg-white "
          }`}
          onClick={() => handleButtonClick("profile", OptionAction.Sell)}
        >
          Sell
        </button>
      </div>
      <div
        className="inline-flex w-full max-w-[170px] rounded-md shadow-sm"
        role="group"
      >
        <button
          type="button"
          className={`inline-flex items-center rounded-s-lg border border-gray-200 px-7 py-2 text-sm font-medium text-gray-500 ${
            selectedOptions.call === OptionType.Call
              ? "bg-gray-100 text-gray-900 focus:z-10"
              : "bg-white"
          }`}
          onClick={() => handleButtonClick("call", OptionType.Call)}
        >
          Call
        </button>
        <button
          type="button"
          className={`inline-flex items-center rounded-e-lg border border-gray-200 px-8 py-2 text-sm font-medium text-gray-500 ${
            selectedOptions.call === OptionType.Put
              ? "bg-gray-100 text-gray-900 focus:z-10"
              : "bg-white "
          }`}
          onClick={() => handleButtonClick("call", OptionType.Put)}
        >
          Put
        </button>
      </div>
    </div>
  );
};

export default GroupButton;
