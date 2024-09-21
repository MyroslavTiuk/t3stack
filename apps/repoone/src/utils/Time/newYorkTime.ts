import { memoizeWith, identity } from 'ramda';

// import { zonedTimeToUtc } from "date-fns-tz";
import moment from 'moment-timezone';

function newYorkTime(dateTime: string) {
  if (!dateTime) {
    return 0;
  }
  const sd = dateTime.replace(/-/g, '');
  const dd = `${sd.slice(0, 4)}-${sd.slice(4, 6)}-${sd.slice(6, 8)}`;
  const dateWithTime = dd.length === 10 ? `${dd} 09:30:00` : dd;
  return moment.tz(dateWithTime, 'America/New_York').unix() * 1000;
  // return zonedTimeToUtc(`${dateWithTime}`, 'America/New_York').getTime();
}

export default memoizeWith(identity, newYorkTime);
