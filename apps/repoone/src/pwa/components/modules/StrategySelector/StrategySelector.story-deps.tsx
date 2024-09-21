import { type StratMenu } from "opc-types/lib/StratMenu";

// @ts-ignore
export const stratMenu: StratMenu = {
  basic: [
    {
      title: "Covered call",
      access: "member",
      stratKey: "covered-call",
      category: { complexity: "basic" },
    },
    {
      title: "Second strat",
      access: "member",
      stratKey: "covered-call",
      category: { complexity: "basic" },
    },
  ],
  spreads: [
    {
      title: "Spread",
      access: "member",
      stratKey: "covered-call",
      category: { complexity: "spreads" },
    },
    {
      title: "Second spread",
      access: "member",
      stratKey: "covered-call",
      category: { complexity: "spreads" },
    },
  ],
};
