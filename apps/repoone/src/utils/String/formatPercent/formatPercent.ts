const formatPercent = (decNum: number, decimals = 1) => {
  return `${Number(100 * decNum).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}%`;
};

export default formatPercent;
