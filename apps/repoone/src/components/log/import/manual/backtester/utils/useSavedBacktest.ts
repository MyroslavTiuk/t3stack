import { useRouter } from "next/router";
import { useEffect } from "react";
import { EquityBackTestInput } from "~/server/strategies/backtest";
import { api } from "~/utils/api";

const useSavedBacktest = (callback: Function) => {
  const router = useRouter();
  const backtesteId = router.query.id;

  const { data: backtest } = api.backtester.getBacktest.useQuery({
    id: Number(backtesteId),
  });

  useEffect(() => {
    if (backtest) {
      console.log("HOOKED", backtest);
      const dataField = backtest.dataFields as EquityBackTestInput;

      console.log("EE", dataField);

      if (dataField) {
        console.log("HOOKEED", dataField);
        callback(dataField);
      }
    }
  }, [backtesteId]);
};

export default useSavedBacktest;
