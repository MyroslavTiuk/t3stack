const getCssExtn = (n: number) => {
  switch (n) {
    case 2:
      return '-2';
    case 3:
      return '-3';
    case 4:
      return '-4';
    case 1 / 2:
      return '-1-2';
    case 1 / 3:
      return '-1-3';
    case 1 / 4:
      return '-1-4';
    case -1:
      return '--1';
    case -2:
      return '--2';
    case -3:
      return '--3';
    case -4:
      return '--4';
    case -1 / 2:
      return '--1-2';
    case -1 / 3:
      return '--1-3';
    case -1 / 4:
      return '--1-4';
    case 1:
      return '';
  }
};

const applyUtilClasses = (prefix: string, value: undefined | number | false) =>
  !value ? false : `${prefix}${getCssExtn(value)}`;

export interface UtilProps {
  m?: number | false;
  mt?: number | false;
  mr?: number | false;
  mb?: number | false;
  ml?: number | false;
  mh?: number | false;
  mv?: number | false;
  p?: number | false;
  pt?: number | false;
  pr?: number | false;
  pb?: number | false;
  pl?: number | false;
  ph?: number | false;
  pv?: number | false;
}

const getUtilClasses = (props: UtilProps) => {
  return [
    'm',
    'mt',
    'mr',
    'mb',
    'ml',
    'mh',
    'mv',
    'p',
    'pt',
    'pr',
    'pb',
    'pl',
    'ph',
    'pv',
  ]
    .map(
      //@ts-ignore (
      (pfx) => applyUtilClasses(pfx, props[pfx]),
    )
    .filter((x) => x !== false);
};

export default getUtilClasses;
