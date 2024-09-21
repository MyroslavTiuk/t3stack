import momentTimezone from "moment-timezone";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

import * as Moment from "moment";
import { extendMoment } from "moment-range";
import { FINANCE } from "../../config/Finance";
import { TIME_DECAY_BASIS } from "../../types/enums/TIME_DECAY_BASIS";
import newYorkTime from "./newYorkTime";
import nonTradingDays from "./nonTradingDays";

const moment = extendMoment(Moment);

const cache: ObjRecord<number> = {};

const TOTAL_TRADING_HOURS_PER_DAY = 6.5;
export const getRemainingTimeForADayBeforeTradingClose = (
  time: momentTimezone.Moment
) => {
  const isNonTradingDay = nonTradingDays.find(
    (nonTradingDay) => nonTradingDay === time.clone().format("yyyyMMDD")
  );

  if (isNonTradingDay) {
    return 0;
  }

  const endTime = time.clone();
  endTime.startOf("day").add(16, "hours");
  const hourDifference = endTime.diff(time, "hours", true);
  if (hourDifference === 0) {
    return 0;
  }
  return hourDifference / TOTAL_TRADING_HOURS_PER_DAY;
};

export const getTradingDaysAfterTheFirstDayUntilExpiration = (
  currentDate: momentTimezone.Moment | Date,
  expirateDate: momentTimezone.Moment | Date
): number => {
  const range = moment.range(currentDate, expirateDate);
  const validDays: string[] = [];

  const dateRanges = Array.from(range.by("days"));
  dateRanges.forEach((item) => {
    const dayOfWeek = item.day();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return;
    }

    const isNonTradingDay = nonTradingDays.find(
      (nonTradingDay) => nonTradingDay === item.format("yyyyMMDD")
    );

    if (isNonTradingDay) {
      return;
    }

    validDays.push(item.format("yyyyMMDD"));
  });

  return validDays?.length || 0;
};

const timeTilExpiry = (
  exp: string | number,
  decayBasis: TIME_DECAY_BASIS,
  time?: number
) => {
  const usedTime = time || Date.now();
  const timeToNearestMinute = Math.round(usedTime / 60000) * 60000;
  const cacheKey = `${exp},${timeToNearestMinute},${decayBasis}`;
  if (cache[cacheKey] !== undefined) {
    return cache[cacheKey] as number;
  }

  const expTime =
    typeof exp === "number" ? exp : newYorkTime(`${exp} 16:00:00`);

  if (decayBasis === TIME_DECAY_BASIS.TRADING_DAYS) {
    const currentTime = moment.tz(time, "America/New_York");

    const remainingTimeInDaysOnFirstDay =
      getRemainingTimeForADayBeforeTradingClose(currentTime);

    const dayAfterTime = currentTime.clone();
    dayAfterTime.startOf("day").add(1, "day");
    const expirateDate = momentTimezone.tz(exp, "America/New_York");

    const tradingDaysCountAfterFirstDay =
      getTradingDaysAfterTheFirstDayUntilExpiration(dayAfterTime, expirateDate);

    return (
      (remainingTimeInDaysOnFirstDay + tradingDaysCountAfterFirstDay) / 252
    );
  }

  const result =
    Math.max(0, (expTime - timeToNearestMinute) / (3600 * 24 * 1000)) /
    FINANCE.DFLT_DAYS_PER_YEAR;
  cache[cacheKey] = result;
  return result;
};

export default timeTilExpiry;
