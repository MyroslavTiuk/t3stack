import moment from "moment-timezone";

import newYorkTime from "../../../../utils/Time/newYorkTime";
import { MS_PER_DAY } from "../../../../consts/DATE_TIME";
import isInfinite from "../../../../utils/Data/isInfinite";

import { type Cfg } from "../index";
import { MATRIX_TIME_GRANULARITY } from "../../strategyEstimates";

const getTheoTimes = (
  cfg: Pick<
    Cfg,
    | "dateTimeMin"
    | "dateMin"
    | "dateMax"
    | "maxTimePoints"
    | "matrixTimeGranularity"
  >
) => {
  const startTimeStartDay = newYorkTime(cfg.dateMin);
  const startTimeCalc = Math.max(
    startTimeStartDay,
    newYorkTime(cfg.dateTimeMin)
  );
  const startTimeStartDate = new Date(startTimeStartDay);
  const endTimeStartDay = newYorkTime(cfg.dateMax);
  const totalTime = endTimeStartDay - startTimeStartDay;
  const days = 1 + totalTime / MS_PER_DAY;

  const timeScale = Math.ceil(days / cfg.maxTimePoints);
  const numPoints = Math.floor(days / timeScale);

  if (isNaN(numPoints) || isInfinite(numPoints) || numPoints <= 0) return [];

  const getDefaultDates = () =>
    Array(numPoints)
      .fill(0)
      .map((_, i) => {
        const newTime = moment(startTimeStartDate)
          .tz("America/New_York")
          .add(i * timeScale, "days")
          .set("hours", 9.5)
          .unix();
        return i === 0 ? startTimeCalc : newTime * 1000;
      });
  const getMonthlyFtntlyDates = () => {
    const includeFortnightly =
      moment(new Date(endTimeStartDay)).subtract(6, "months").unix() * 1000 <
      startTimeStartDay;
    const dates = [startTimeStartDay];

    if (includeFortnightly) {
      const nextDateFtnt =
        moment(new Date(endTimeStartDay))
          .tz("America/New_York")
          .subtract(2, "weeks")
          .set("hours", 9.5)
          .unix() * 1000;
      if (nextDateFtnt > startTimeStartDay) dates.push(nextDateFtnt);
    }
    let nextDate =
      moment(new Date(endTimeStartDay))
        .tz("America/New_York")
        .subtract(1, "month")
        .set("hours", 9.5)
        .unix() * 1000;
    while (nextDate > startTimeStartDay) {
      if (includeFortnightly) {
        const nextDateFtnt =
          moment(new Date(nextDate))
            .tz("America/New_York")
            .subtract(2, "weeks")
            .set("hours", 9.5)
            .unix() * 1000;
        if (nextDateFtnt > startTimeStartDay) dates.push(nextDateFtnt);
      }

      dates.push(nextDate);
      nextDate =
        moment(new Date(nextDate))
          .tz("America/New_York")
          .subtract(1, "month")
          .set("hours", 9.5)
          .unix() * 1000;
    }
    return dates.sort();
  };

  const calcDates =
    cfg.matrixTimeGranularity === MATRIX_TIME_GRANULARITY.FORTNIGHTLY_MONTHLY
      ? getMonthlyFtntlyDates()
      : getDefaultDates();

  return (
    calcDates
      .concat(
        calcDates.includes(endTimeStartDay) || startTimeCalc > endTimeStartDay
          ? []
          : [endTimeStartDay]
      )
      // Add expiry (4pm of last dateMax)
      .concat([endTimeStartDay + 1000 * 60 * 60 * 6.5])
  );
};

export default getTheoTimes;
