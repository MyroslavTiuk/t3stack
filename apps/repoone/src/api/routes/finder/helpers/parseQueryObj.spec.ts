import parseQueryObj from "./parseQueryObj";

describe("parseQueryObj", () => {
  test("ctnr", () => {
    const expected = {
      one: 1,
      two: 2,
    };

    const actual = parseQueryObj(
      {
        // @ts-ignore
        "ctnr[one]": 1,
        // @ts-ignore
        "ctnr[two]": 2,
      },
      "ctnr"
    );

    expect(actual).toEqual(expected);
  });
});
