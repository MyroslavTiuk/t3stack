import ProfitChart from "~/components/FlowBite/ShowChart";
import React from "react";
import { api } from "~/utils/api";

export default function WeekProfit() {
  const { data } = api.analytics.getIncomeByWeekday.useQuery();

  return (
    <ProfitChart
      data={data?.map((d: any) => ({ name: d.name, profit: d.value })) ?? []}
    />
  );
}
