import { MATRIX_TIME_GRANULARITY } from "../../strategyEstimates";
import getTheoTimes from "./getTheoTimes";

describe("services/calculate/theoPositions/helpers/getTheoTimes", () => {
  test("Within maxTimePoints", () => {
    const expected = [
      1590067800000, 1590154200000, 1590240600000, 1590327000000, 1590413400000,
      1590499800000, 1590586200000, 1590672600000, 1590759000000, 1590845400000,
      1590931800000, 1591018200000, 1591104600000, 1591191000000, 1591277400000,
      1591363800000, 1591450200000, 1591536600000, 1591623000000, 1591709400000,
      1591732800000,
    ];

    const result = getTheoTimes({
      dateTimeMin: "2020-05-21 14:30:00",
      dateMin: "2020-05-21",
      dateMax: "2020-06-09",
      maxTimePoints: 30,
      matrixTimeGranularity: MATRIX_TIME_GRANULARITY.BEST_FIT,
    });

    expect(result).toEqual(expected);
  });

  test("Over maxTimePoints, 2D timescale", () => {
    const expected = [
      1590067800000, 1590240600000, 1590413400000, 1590586200000, 1590759000000,
      1590931800000, 1591104600000, 1591277400000, 1591450200000, 1591623000000,
      1591795800000, 1591968600000, 1592141400000, 1592314200000, 1592487000000,
      1592659800000, 1592832600000, 1593005400000, 1593178200000, 1593264600000,
      1593288000000,
    ];

    const result = getTheoTimes({
      dateTimeMin: "2020-05-21 14:30:00",
      dateMin: "2020-05-21",
      dateMax: "2020-06-27",
      maxTimePoints: 30,
      matrixTimeGranularity: MATRIX_TIME_GRANULARITY.BEST_FIT,
    });

    expect(result).toEqual(expected);
  });

  test("Within 6 months, ftntly granularity", () => {
    const expected = [
      1590067800000, 1590586200000, 1592055000000, 1593264600000, 1594647000000,
      1595856600000, 1597325400000, 1598535000000, 1600003800000, 1601213400000,
      1601236800000,
    ];

    const result = getTheoTimes({
      dateTimeMin: "2020-05-21 14:30:00",
      dateMin: "2020-05-21",
      dateMax: "2020-09-27",
      maxTimePoints: 30,
      matrixTimeGranularity: MATRIX_TIME_GRANULARITY.FORTNIGHTLY_MONTHLY,
    });

    expect(result).toEqual(expected);
  });

  test("Outside 6 months, monthly granularity", () => {
    const expected = [
      1590067800000, 1590586200000, 1593264600000, 1595856600000, 1598535000000,
      1601213400000, 1603805400000, 1606487400000, 1606510800000,
    ];

    const result = getTheoTimes({
      dateTimeMin: "2020-05-21 14:30:00",
      dateMin: "2020-05-21",
      dateMax: "2020-11-27",
      maxTimePoints: 30,
      matrixTimeGranularity: MATRIX_TIME_GRANULARITY.FORTNIGHTLY_MONTHLY,
    });

    expect(result).toEqual(expected);
  });
});
