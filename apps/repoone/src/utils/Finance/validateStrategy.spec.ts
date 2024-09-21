import validateStrategy from "./validateStrategy";
import { type Strategy } from "opc-types/lib/Strategy";
import { ifErr, isErr } from "errable";
import { testPartialStrategyLongCall } from "../../services/calculate/helpers/testPartialStrategyLongCall";

describe("services/calculate/validateStrategy", () => {
  test("When option has all data, passes validation", () => {
    const expected = true;

    const result = validateStrategy(
      testPartialStrategyLongCall as unknown as Strategy
    );

    expect(result).toEqual(expected);
  });

  test("When missing a field, passes fails", () => {
    const expected = ["Option missing fields"];
    const failFix = {
      ...testPartialStrategyLongCall,
      legsById: {
        option: {
          ...testPartialStrategyLongCall.legsById.option,
          price: null,
        },
      },
    };

    const result = validateStrategy(failFix as unknown as Strategy);

    expect(isErr(result)).toEqual(true);
    ifErr((err) => {
      expect(err).toEqual(expected);
      return true;
    }, result);
  });
});
