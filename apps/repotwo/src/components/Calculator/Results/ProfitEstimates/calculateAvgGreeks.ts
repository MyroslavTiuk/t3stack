import {
  type CalculatorOption,
  type ProfitEstimate,
} from "@utils/calculateProfitEstimates/calculateProfitEstimates";

type AvgGreeks = {
  iv: ProfitEstimate<number>;
  delta: ProfitEstimate<number>;
  gamma: ProfitEstimate<number>;
  theta: ProfitEstimate<number>;
};

export function calculateAvgGreeks(contracts: {
  [legIndex: number]: CalculatorOption;
}): AvgGreeks {
  const sum = Object.values(contracts).reduce(
    (total, contract) => {
      return {
        iv: total.iv + contract.volatility,
        delta: total.delta + (contract.delta ?? 0),
        gamma: total.gamma + (contract.gamma ?? 0),
        theta: total.theta + (contract.theta ?? 0),
      };
    },
    { iv: 0, delta: 0, gamma: 0, theta: 0 }
  );
  const count = Math.max(Object.keys(contracts).length, 1);

  return {
    iv: {
      value: sum.iv / count,
      formattedValue: (sum.iv / count).toFixed(2),
      title: "IV",
      icon: "/Icons/IV.svg",
    },
    delta: {
      value: sum.delta / count,
      formattedValue: (sum.delta / count).toFixed(2),
      title: "Delta",
      icon: "/Icons/Delta.svg",
    },
    gamma: {
      value: sum.gamma / count,
      formattedValue: (sum.gamma / count).toFixed(2),
      title: "Gamma",
      icon: "/Icons/Gamma.svg",
    },
    theta: {
      value: sum.theta / count,
      formattedValue: (sum.theta / count).toFixed(2),
      title: "Theta",
      icon: "/Icons/Theta.svg",
    },
  };
}
