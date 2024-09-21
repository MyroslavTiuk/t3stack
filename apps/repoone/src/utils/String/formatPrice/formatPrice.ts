import ifUndef from '../../Data/ifUndef/ifUndef';

type Cfg = {
  forceShowCents: boolean;
  hideDollar: boolean;
  forcePlus: boolean;
  hideMinus: boolean;
  includeThousandSep: boolean;
};

const formatPrice = (n: number, cfg: Partial<Cfg> = {}) => {
  const cfgFilled: Cfg = {
    forceShowCents: ifUndef(cfg.forceShowCents, false),
    hideDollar: ifUndef(cfg.hideDollar, false),
    forcePlus: ifUndef(cfg.forcePlus, false),
    hideMinus: ifUndef(cfg.hideMinus, true),
    includeThousandSep: ifUndef(cfg.includeThousandSep, true),
  };
  const posNeg =
    cfgFilled.forcePlus && n > 0
      ? '+'
      : n < 0 && !cfgFilled.hideMinus
      ? '-'
      : '';
  const usedN = Math.abs(n); //cfgFilled.abs ? Math.abs(n) :
  const S = !cfgFilled.hideDollar ? '$' : '';
  return `${posNeg}${S}${
    cfgFilled.forceShowCents || Math.round(usedN) !== Math.round(usedN * 100) / 100 
      ? Number(usedN).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
          useGrouping: cfgFilled.includeThousandSep,
        })
      : Number(usedN).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          useGrouping: cfgFilled.includeThousandSep,
        })
  }`;
};

export const makeFormatPrice = (cfg: Partial<Cfg>) => (n: number) =>
  formatPrice(n, cfg);

export default formatPrice;
