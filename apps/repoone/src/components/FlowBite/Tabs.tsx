import { Card, Tabs } from "flowbite-react";
import ProfitChart from "./ShowChart";
import { api } from "~/utils/api";
import React from "react";
import WeekProfit from "~/components/analytics/WeekProfit";

const theme = {
  tablist: {
    tabitem: {
      base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
      styles: {
        underline: {
          base: "rounded-t-lg",
          active: {
            on: "text-blue rounded-t-lg border-b-2 border-blue active dark:text-cyan-500 dark:border-cyan-500",
            off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
          },
        },
      },
    },
  },
};

export function TabsComponent() {
  const { data: dataByMonth } = api.analytics.getIncomeByMonth.useQuery();

  return (
    <div className="w-[100vw] sm:w-[80vw]">
      <Card>
        <Tabs
          theme={theme}
          aria-label="Tabs with underline"
          style="underline"
          className="focus:outline-none"
        >
          <Tabs.Item active title="1D" className="text-blue focus:outline-none">
            <ProfitChart data={dataByMonth ? dataByMonth.strategies : []} />
          </Tabs.Item>
          <Tabs.Item title="1W">
            <WeekProfit />
          </Tabs.Item>
          <Tabs.Item title="1M">
            <ProfitChart data={dataByMonth ? dataByMonth.days : []} />
          </Tabs.Item>
          <Tabs.Item title="3M">
            <ProfitChart data={dataByMonth ? dataByMonth.strategies : []} />
          </Tabs.Item>
        </Tabs>
      </Card>
    </div>
  );
}
