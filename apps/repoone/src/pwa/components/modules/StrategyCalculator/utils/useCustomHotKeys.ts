import { useHotkeys } from "react-hotkeys-hook";

export enum CalculatorKeys {
  openOptionsChain = "o",
  increaseStrikePrice = "up",
  decreaseStrikePrice = "down",
  lowerExpirationDate = "left",
  higherExpirationDate = "right",
  enterNewStock = "s",
  switchBetweenBuySell = "e",
}

const useCustomHotkeysCalculator = (
  key: CalculatorKeys,
  onShortcut: () => void
) => {
  let platform = "win";

  if (navigator.userAgent.indexOf("Mac") > -1) {
    platform = "mac";
  } else if (navigator.userAgent.indexOf("Linux") > -1) {
    platform = "lin";
  }

  const modifierKey = platform === "mac" ? "command" : "ctrl";

  const keyCut = `${modifierKey}+${key}`;

  useHotkeys(keyCut, (event) => {
    onShortcut();
    event.preventDefault();
  });
};

export default useCustomHotkeysCalculator;
