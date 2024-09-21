import {
  type OptionsChain,
  type OptionsChain_options,
} from "opc-types/lib/OptionsChain";
import * as R from "ramda";

interface TableData {
  call: {
    date: string;
    dateDesc: string;
    bidPrice: string;
    askPrice: string;
    lastPrice: string;
    implVolume: string;
    openInt: string;
    volume: string;
    strike: string;
  };
  put: {
    date: string;
    dateDesc: string;
    bidPrice: string;
    askPrice: string;
    lastPrice: string;
    implVolume: string;
    openInt: string;
    volume: string;
    strike: string;
  };
}

export enum ExpiryType {
  Standard = "Standard",
  Weekly = "Weekly",
}
const parseExpiry = (
  dateCode: string,
  dateString: string
): { dateString: string } => {
  const trimmedDateString = dateCode.replace(/-/g, "");

  const isWeekly = dateString.search("Weekly") !== -1;
  return {
    dateString: `${trimmedDateString}${isWeekly ? "W" : ""}`,
  };
};

export default function getOptionsChainFromTableData(
  tableData: TableData[],
  _: string
): OptionsChain {
  if (R.isNil(tableData)) {
    return {};
  }
  return tableData.reduce((optionsChain, tableItem): OptionsChain => {
    const { dateString } = parseExpiry(
      tableItem.call.date,
      tableItem.call.dateDesc
    );
    const { call, put } = tableItem;
    const callStrikeValues = {
      l: parseFloat(call.lastPrice),
      b: parseFloat(call.bidPrice),
      a: parseFloat(call.askPrice),
      v: parseFloat(call.volume),
    };
    const putStrikeValues = {
      l: parseFloat(put.lastPrice),
      b: parseFloat(put.bidPrice),
      a: parseFloat(put.askPrice),
      v: parseFloat(put.volume),
    };
    const strike = parseFloat(call.strike.replace(/,/g, ""));
    const strikeValues = {
      c: {
        [strike]: callStrikeValues,
      },
      p: {
        [strike]: putStrikeValues,
      },
    };

    let neRowValue = {
      [dateString]: {
        ...strikeValues,
      },
    };

    if (R.has(dateString, optionsChain)) {
      const existingCallStrikeValues = (R.path(
        [dateString, "c"],
        optionsChain
      ) || {}) as OptionsChain_options;
      const existingPutStrikeValues = (R.path(
        [dateString, "p"],
        optionsChain
      ) || {}) as OptionsChain_options;

      neRowValue = {
        [dateString]: {
          c: {
            ...existingCallStrikeValues,
            [strike]: callStrikeValues,
          },
          p: {
            ...existingPutStrikeValues,
            [strike]: putStrikeValues,
          },
        },
      };
    }

    const updatedValue = {
      ...optionsChain,
      ...neRowValue,
    } as OptionsChain;
    return updatedValue;
  }, {});
}
