import { MARKETS } from "../../../consts";
import { normaliseSymbol, getExchange, getStockSymbol } from "./market";

describe("utils/market", () => {
  describe("normaliseSymbol", () => {
    test("makes lowercase", () => {
      const input = "Asx.TSX";
      const expected = "asx.tsx";

      expect(normaliseSymbol(input)).toBe(expected);
    });

    test("trims spaces", () => {
      const input = "\tasx.tsx  ";
      const expected = "asx.tsx";

      expect(normaliseSymbol(input)).toBe(expected);
    });
  });

  describe("getExchange", () => {
    test("finds an exchange, case insensitive", () => {
      const input = "Asx.TSX";
      const expected: string = MARKETS.AU;

      expect(getExchange(input)).toBe(expected);
    });

    test("matches cboe on default", () => {
      const input = "wmt";
      const expected: string = MARKETS.US;

      expect(getExchange(input)).toBe(expected);
    });
  });

  describe("getStockSymbol", () => {
    test("finds a symbol when market is present", () => {
      const input = "Asx.TSX";
      const expected = "tsx";

      expect(getStockSymbol(input)).toBe(expected);
    });

    test("finds symbol on default", () => {
      const input = "wmt";
      const expected = "wmt";

      expect(getStockSymbol(input)).toBe(expected);
    });

    test("finds symbol on default, trims", () => {
      const input = "\twmt";
      const expected = "wmt";

      expect(getStockSymbol(input)).toBe(expected);
    });

    test("retains prefix dot for exchanges", () => {
      const input = ".dji";
      const expected = ".dji";

      expect(getStockSymbol(input)).toBe(expected);
    });

    test("retains prefix dot for exchanges, and trims", () => {
      const input = " .dji ";
      const expected = ".dji";

      expect(getStockSymbol(input)).toBe(expected);
    });
  });
});
