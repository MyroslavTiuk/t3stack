import { create } from "zustand";
import { type Strategy, strategyConfigs } from "@data/strategies.data";
import produce from "immer";
import {
  type CalculatorOption,
  type Equity,
} from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import { Position } from "optionscout-database";

type CalculatorStoreState = {
  strategy: Strategy;
  setStrategy: (strategy: Strategy) => void;
  stockSymbol: string | null;
  setSymbol: (symbol: string | null) => void;
  contracts: CalculatorOption[];
  setContract: (contract: CalculatorOption, legIndex: number) => void;
  setContractsCount: (contractsCount: number, legIndex: number) => void;
  resetContracts: () => void;
  addContract: (contract: CalculatorOption) => void;
  removeContract: (legIndex: number) => void;
  expirationDateKeys: { first: string; second?: string } | null;
  setExpirationDateKeys: (
    expirationDateKeys: { first: string; second?: string } | null
  ) => void;
  equity: Equity;
  setEquity: (equity: Equity) => void;
  reset: () => void;
};

export const useCalculatorStore = create<CalculatorStoreState>((set) => ({
  strategy: "covered-call" as const,
  setStrategy: (strategy) =>
    set(
      produce((state) => {
        state.strategy = strategy;
        state.contracts = buildContractsFromStrategy(strategy);
        if (strategyConfigs[strategy].equity) {
          state.equity = {
            position: strategyConfigs[strategy].equity,
            shares: 100,
          };
        }
      })
    ),
  stockSymbol: null,
  setSymbol: (stockSymbol) => set({ stockSymbol }),
  contracts: [],
  setContract: (contract, legIndex) =>
    set(
      produce((state) => {
        state.contracts[legIndex] = contract;
      })
    ),
  setContractsCount: (contractsCount, legIndex) =>
    set(
      produce((state) => {
        state.contracts[legIndex].contractsCount = contractsCount;
      })
    ),
  resetContracts: () =>
    set(
      produce((state) => {
        state.contracts = buildContractsFromStrategy(state.strategy);
      })
    ),
  addContract: (contract) =>
    set(
      produce((state) => {
        state.contracts = [...state.contracts, contract];
      })
    ),
  removeContract: (legIndex) =>
    set(
      produce((state) => {
        state.contracts.splice(legIndex, 1);
      })
    ),
  expirationDateKeys: null,
  setExpirationDateKeys: (expirationDateKeys) => set({ expirationDateKeys }),
  equity: { position: Position.Long, shares: 0 },
  setEquity: (equity) => set({ equity }),
  reset: () =>
    set(
      produce((state) => {
        state.stockSymbol = null;
        state.contracts = buildContractsFromStrategy(state.strategy);
        state.expirationDateKeys = null;
        state.equity.shares = 0;
      })
    ),
}));

function buildContractsFromStrategy(strategy: Strategy) {
  return strategyConfigs[strategy].legs.map((leg) => ({
    strikePrice: 0,
    optionPrice: 0,
    daysToExpiration: 0,
    position: leg.position,
    optionType: leg.optionType,
    volatility: 0,
    contractsCount: leg.multiplier,
  }));
}
