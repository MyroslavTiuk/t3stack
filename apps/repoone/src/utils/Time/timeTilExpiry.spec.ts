import moment from 'moment-timezone';
// import { zonedTimeToUtc } from 'date-fns-tz';
import { TIME_DECAY_BASIS } from '../../types/enums/TIME_DECAY_BASIS';
import timeTilExpiry from './timeTilExpiry';

describe('services/calculate/timeTilExpiry', () => {
  // 24 Apr 2020 is a Friday during a normal week
  // tslint:disable-next-line: variable-name
  const standardWeekExpiry_2020_04_24 = '2020-04-24';

  // 21 Feb 2020 is a Friday during a week where the Monday is a public holiday
  // tslint:disable-next-line: variable-name
  const longWeekendExpiry_2020_02_21 = '2020-02-21';

  test('converts from exactly a day-and-a-half prior with calendar days', () => {
    const testTime =
      moment.tz('2020-04-23 04:00:00', 'America/New_York').unix() * 1000;
    const expected = 1.5 / 365;

    const result: number = timeTilExpiry(
      standardWeekExpiry_2020_04_24,
      TIME_DECAY_BASIS.CALENDAR_DAYS,
      testTime,
    );

    expect(result).toEqual(expected);
  });

  describe('Trading days', () => {
    test('Exactly one day out, on a normal Thursday at end of day (before Friday expiry)', () => {
      // No time left on Thursday before trading closes, whole of Friday trading day
      const testTime =
        moment.tz('2020-04-23 16:00:00', 'America/New_York').unix() * 1000;
      const expected = 1 / 252;

      const result: number = timeTilExpiry(
        standardWeekExpiry_2020_04_24,
        TIME_DECAY_BASIS.TRADING_DAYS,
        testTime,
      );

      expect(result).toEqual(expected);
    });

    test('From midday on the day of expiry', () => {
      const testTime =
        moment.tz('2020-02-21 12:45:00', 'America/New_York').unix() * 1000;
      const expected = 0.5 / 252;

      const result: number = timeTilExpiry(
        longWeekendExpiry_2020_02_21,
        TIME_DECAY_BASIS.TRADING_DAYS,
        testTime,
      );

      expect(result).toEqual(expected);
    });

    test('Midday Thursday, standard trading week', () => {
      // Half of the day Thursday + Whole day Friday
      const testTime =
        moment.tz('2020-04-23 12:45:00', 'America/New_York').unix() * 1000;
      const expected = 1.5 / 252;

      const result: number = timeTilExpiry(
        standardWeekExpiry_2020_04_24,
        TIME_DECAY_BASIS.TRADING_DAYS,
        testTime,
      );

      expect(result).toEqual(expected);
    });

    test('Morning of Thursday, standard trading week', () => {
      // Whole day Thursday (0930-1600) + whole day Friday (0930-1600)
      const testTime =
        moment.tz('2020-04-23 09:30:00', 'America/New_York').unix() * 1000;
      const expected = 2 / 252;

      const result: number = timeTilExpiry(
        standardWeekExpiry_2020_04_24,
        TIME_DECAY_BASIS.TRADING_DAYS,
        testTime,
      );

      expect(result).toEqual(expected);
    });

    test('End of day Wednesday, standard trading week', () => {
      // No time on Wednesday, + whole day Thursday + Friday (as previous test)
      const testTime =
        moment.tz('2020-04-22 16:00:00', 'America/New_York').unix() * 1000;
      const expected = 2 / 252;

      const result: number = timeTilExpiry(
        standardWeekExpiry_2020_04_24,
        TIME_DECAY_BASIS.TRADING_DAYS,
        testTime,
      );

      expect(result).toEqual(expected);
    });
  });

  test('One hour remaining on Thursday', () => {
    // 1 hour (1/6.5) of Thursday, then all of Friday
    const testTime =
      moment.tz('2020-04-23 15:00:00', 'America/New_York').unix() * 1000;
    const expected = (1 / 6.5 + 1) / 252;

    const result: number = timeTilExpiry(
      standardWeekExpiry_2020_04_24,
      TIME_DECAY_BASIS.TRADING_DAYS,
      testTime,
    );

    expect(result).toEqual(expected);
  });

  test('Morning of the previous Thursday.  Standard trading week, should exclude weekend days', () => {
    // Whole day Thursday + Friday of first week (2 days), then all of following week M-F (5 days)
    const testTime =
      moment.tz('2020-04-16 09:30:00', 'America/New_York').unix() * 1000;
    const expected = (2 + 5) / 252;

    const result: number = timeTilExpiry(
      standardWeekExpiry_2020_04_24,
      TIME_DECAY_BASIS.TRADING_DAYS,
      testTime,
    );

    expect(result).toEqual(expected);
  });

  test('Morning of Thursday preceding a Monday long weekend', () => {
    // Whole day Thursday + Friday of first week (2 days), then T-F of following week, as Monday is a holiday
    const testTime =
      moment.tz('2020-02-13 09:30:00', 'America/New_York').unix() * 1000;
    const expected = (2 + 4) / 252;

    const result: number = timeTilExpiry(
      longWeekendExpiry_2020_02_21,
      TIME_DECAY_BASIS.TRADING_DAYS,
      testTime,
    );

    expect(result).toEqual(expected);
  });

  test('Ignore Morning public holiday', () => {
    // Ignore the half-day on Monday (17th), Count Tu-F only
    const testTime =
      moment.tz('2020-02-17 12:45:00', 'America/New_York').unix() * 1000;
    const expected = 4 / 252;

    const result: number = timeTilExpiry(
      longWeekendExpiry_2020_02_21,
      TIME_DECAY_BASIS.TRADING_DAYS,
      testTime,
    );

    expect(result).toEqual(expected);
  });

  test('Two weeks from midday on Wednesday, including one long weekend', () => {
    // Ignore Monday, Tu-F only
    const testTime =
      moment.tz('2020-02-05 12:45:00', 'America/New_York').unix() * 1000;
    const expected = (2.5 + 5 + 4) / 252;

    const result: number = timeTilExpiry(
      longWeekendExpiry_2020_02_21,
      TIME_DECAY_BASIS.TRADING_DAYS,
      testTime,
    );

    expect(result).toEqual(expected);
  });
});
