import getStrikesFromChain from "./getStrikesFromChain";
import { type OptionsChain_types } from "opc-types/lib/OptionsChain";
import { type OptionData } from "opc-types/lib/OptionData";

describe("pwa/components/modules/StrategyCalculator/OptionsChain/utils/getStrikesFromChain", () => {
  const fixture: OptionsChain_types = {
    c: {
      10: {} as OptionData,
      10.5: {} as OptionData,
      11: {} as OptionData,
    },
    p: {
      10.5: {} as OptionData,
      11: {} as OptionData,
      11.5: {} as OptionData,
    },
  };

  test("Extracts prices", () => {
    const expected = [10, 10.5, 11, 11.5];

    const result = getStrikesFromChain(fixture);

    expect(result).toEqual(expected);
  });
});
