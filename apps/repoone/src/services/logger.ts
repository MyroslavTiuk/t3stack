import ENV from '../config/Env';

const sevSymbs = {
  debug: '🐛',
  info: 'Ⓘ ',
  error: '🛑',
  warn: '⚠️',
};

const sevColors = {
  info: 34,
  debug: 35,
  warn: 33,
  error: '41m\x1b[37',
};

const log = (sev: string) => (...data: any[]) => {
  const d = new Date().toISOString();
  // @ts-ignore
  const clr = sevColors[sev] as number;
  console.log(
    `\x1b[${clr}m %s \x1b[0m\x1b[2m\x1b[37m %s %s\x1b[0m \x1b[${clr}m %s \x1b[0m`,
    // @ts-ignore
    sevSymbs[sev],
    d.substr(0, 10),
    d.substr(11, 11),
    ...data,
  );
};

type Logger = (...data: any[]) => void;

type L = {
  debug: Logger;
  info: Logger;
  error: Logger;
  warn: Logger;
} & Logger;

let l: L;

// @ts-ignore ; todo: register error with service on IS_PROD
l = !ENV.IS_PROD ? log('debug') : () => {};
l.debug = l;

//   // todo: add env checks
l.info = log('info');
l.error = log('error');
l.warn = log('warn');

export default l;
