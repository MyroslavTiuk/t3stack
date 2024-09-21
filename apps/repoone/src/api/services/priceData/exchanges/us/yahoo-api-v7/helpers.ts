import determineFetchUrl from '../../../../http/determineFetchUrl';

export const proxyUrl = (url: string) => {
  return determineFetchUrl(url, url, true)[0];
};

const chrSet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
const randChrs = () =>
  Array(11)
    .fill('')
    .map((_: string) => chrSet[Math.floor(Math.random() * chrSet.length)]);

export const makeUrl = (symb: string, date?: number) => {
  const nDate = date ? `&date=${date}` : '';
  return `https://query1.finance.yahoo.com/v7/finance/options/${symb}?crumb=${randChrs()}&lang=en-US&region=US${nDate}&corsDomain=finance.yahoo.com`;
};
