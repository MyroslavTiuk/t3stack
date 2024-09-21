// import _ from '_';

const timeFromYMD = (yyyymmdd: string) => {
  return new Date(
    parseInt(yyyymmdd.substr(0, 4), 10),
    parseInt(yyyymmdd.substr(4, 2), 10) - 1,
    parseInt(yyyymmdd.substr(6, 2), 10),
  ).getTime();
};

export default timeFromYMD;
