import moment from 'moment-timezone';
import { FMT_YYYY_MM_DD, FMT_YYYY_MM_DD_HHMM } from '../../consts/DATE_TIME';

const currentNewYorkYMD = (hh = false) => {
  return moment
    .tz('America/New_York')
    .format(hh ? FMT_YYYY_MM_DD_HHMM : FMT_YYYY_MM_DD);
};

export default currentNewYorkYMD;
