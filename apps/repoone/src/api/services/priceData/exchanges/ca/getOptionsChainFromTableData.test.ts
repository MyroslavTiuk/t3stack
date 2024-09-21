import getOptionsChainFromTableData from "./getOptionsChainFromTableData";

describe("getOptionsChainFromTableData", () => {
  it("should return the correct options chain data", () => {
    const optionsData = getOptionsChainFromTableData(
      [
        {
          // @ts-ignore
          call: {
            date: "T     210102C27.50 (Weekly)",
            bidPrice: "1",
            askPrice: "1",
            lastPrice: "1",
            implVolume: "1",
            openInt: "1",
            volume: "1",
            strike: "1",
          },
          // @ts-ignore
          put: {
            date: "T     210102C27.50 (Weekly)",
            bidPrice: "1.1",
            askPrice: "1.1",
            lastPrice: "1.1",
            implVolume: "1.1",
            openInt: "1.1",
            volume: "1.1",
            strike: "1",
          },
        },
        {
          // @ts-ignore
          call: {
            date: "T     210103C27.50",
            bidPrice: "2",
            askPrice: "2",
            lastPrice: "2",
            implVolume: "2",
            openInt: "2",
            volume: "2",
            strike: "2",
          },
          // @ts-ignore
          put: {
            date: "T     210103C27.50",
            bidPrice: "2.2",
            askPrice: "2.2",
            lastPrice: "2.2",
            implVolume: "2.2",
            openInt: "2.2",
            volume: "2.2",
            strike: "2",
          },
        },
        {
          // @ts-ignore
          call: {
            date: "T     210103C27.50",
            bidPrice: "4",
            askPrice: "4",
            lastPrice: "4",
            implVolume: "4",
            openInt: "4",
            volume: "4",
            strike: "4",
          },
          // @ts-ignore
          put: {
            date: "T     210103C27.50",
            bidPrice: "4.2",
            askPrice: "4.2",
            lastPrice: "4.2",
            implVolume: "4.2",
            openInt: "4.2",
            volume: "4.2",
            strike: "4",
          },
        },
      ],
      "T"
    );

    expect(JSON.stringify(optionsData)).toEqual(
      JSON.stringify({
        "20210102": {
          expiryType: "Weekly",
          c: { "1": { l: 1, b: 1, a: 1, v: 1, i: 1 } },
          p: { "1": { l: 1.1, b: 1.1, a: 1.1, v: 1.1, i: 1.1 } },
        },
        "20210103": {
          expiryType: "Standard",
          c: {
            "2": { l: 2, b: 2, a: 2, v: 2, i: 2 },
            "4": { l: 4, b: 4, a: 4, v: 4, i: 4 },
          },
          p: {
            "2": { l: 2.2, b: 2.2, a: 2.2, v: 2.2, i: 2.2 },
            "4": { l: 4.2, b: 4.2, a: 4.2, v: 4.2, i: 4.2 },
          },
        },
      })
    );
  });
});
