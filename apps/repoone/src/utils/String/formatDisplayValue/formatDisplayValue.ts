import round from "../../Data/round/round";

const forceDecimals = (n: number) => ({
  minimumFractionDigits: n,
  maximumFractionDigits: n,
  useGrouping: false,
});

function formatDisplayValue(val: number) {
  let disVal = "";
  if (isNaN(val)) return "N/A";
  if (Math.abs(val) >= 10000)
    disVal =
      round(val / 1000, 1).toLocaleString("en-US", forceDecimals(1)) + "k";
  // else if (val <= -1000) disVal = round(val / 1000, 2)+"k";
  else {
    const rndVal2 = round(val, 2);
    const rndVal1 = round(val, 1);
    const rndVal0 = round(val, 0);
    if (rndVal0 >= 100 || rndVal0 <= -100)
      disVal = val.toLocaleString("en-US", forceDecimals(0));
    else if (rndVal1 >= 10 || rndVal1 <= -10)
      disVal = val.toLocaleString("en-US", forceDecimals(1));
    else if (rndVal2 === 0) disVal = "0";
    else if (rndVal2 < 10 || rndVal2 > -10)
      disVal = rndVal2.toLocaleString("en-US", forceDecimals(2));
    else disVal = rndVal2.toString();
  }
  // else if (val <= -1000 && val > -10000) disVal = `-${-disVal}`;
  return disVal;
}

export default formatDisplayValue;
