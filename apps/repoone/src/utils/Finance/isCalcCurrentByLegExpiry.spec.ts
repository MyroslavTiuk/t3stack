import isCalcCurrentByLegExpiry from "./isCalcCurrentByLegExpiry";

describe("isCalcCurrentByLegExpiry", () => {
  // 26 Jan '21 ish
  const fixNow = 1611641779667;

  test("Both legs expired", () => {
    const expected = false;

    const calc = {
      legsById: {
        underlying: {
          type: "stock",
        },
        short: {
          expiry: "20210101",
          type: "option",
        },
        long: {
          expiry: "20210101",
          type: "option",
        },
      },
      legs: ["underlying", "short", "long"],
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore;
    const actual = isCalcCurrentByLegExpiry(calc, fixNow);

    expect(actual).toEqual(expected);
  });

  test("Incomplete", () => {
    const expected = false;

    const calc = {
      legsById: {
        option: {
          expiry: null,
          type: "option",
        },
      },
      legs: ["option"],
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore;
    const actual = isCalcCurrentByLegExpiry(calc, fixNow);

    expect(actual).toEqual(expected);
  });

  test("One legs expired", () => {
    const expected = true;

    const calc = {
      legsById: {
        short: {
          expiry: "20220101",
          type: "option",
        },
        long: {
          expiry: "20210101",
          type: "option",
        },
      },
      legs: ["short", "long"],
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore;
    const actual = isCalcCurrentByLegExpiry(calc, fixNow);

    expect(actual).toEqual(expected);
  });
  test("Both legs valid (same day)", () => {
    const expected = true;

    const calc = {
      legsById: {
        short: {
          expiry: "20210126",
          type: "option",
        },
        long: {
          expiry: "20210126",
          type: "option",
        },
      },
      legs: ["short", "long"],
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore;
    const actual = isCalcCurrentByLegExpiry(calc, fixNow);

    expect(actual).toEqual(expected);
  });
});
