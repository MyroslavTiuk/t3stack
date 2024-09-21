import round from "../../utils/Data/round/round";
import { type Optional } from "errable/dist";
import { FINANCE } from "../../config/Finance";

/* Returns probability of occuring below and above target price. */
export function probability(
  price: number,
  target: number,
  t: number,
  volatility100: number
) {
  const p = price;
  const q = target;
  const volatility = volatility100 / 100;

  const x = normalcdf(0, 1, Math.log(q / p) / (volatility * Math.sqrt(t)));

  return [1 - x, x];
}

// const b1 = 0.31938153;
// const b2 = -0.356563782;
// const b3 = 1.781477937;
// const b4 = -1.821255978;
// const b5 = 1.330274429;
// const p = 0.2316419;
// const c2 = 0.3989423;

function normsdist(z: number) {
  let k, m, total, item, a, b;

  // Power series is not stable at these extreme tail scenarios
  if (z < -6) {
    return 0;
  }
  if (z > 6) {
    return 1;
  }

  m = 1; // m(k) == (2**k)/factorial(k)
  b = z; // b(k) == z ** (2*k + 1)
  const z2 = z * z; // cache of z squared
  const z4 = z2 * z2; // cache of z to the 4th
  const values = [];

  // Compute the power series in groups of two terms.
  // This reduces floating point errors because the series
  // alternates between positive and negative.
  for (k = 0; k < 100; k += 2) {
    a = 2 * k + 1;
    item = b / (a * m);
    item *= 1 - (a * z2) / ((a + 1) * (a + 2));
    values.push(item);
    m *= 4 * (k + 1) * (k + 2);
    b *= z4;
  }

  // Add the smallest terms to the total first that
  // way we minimize the floating point errors.
  total = 0;
  for (k = 49; k >= 0; k--) {
    total += values[k];
  }

  // Multiply total by 1/sqrt(2*PI)
  // Then add 0.5 so that stdNormal(0) === 0.5
  return 0.5 + 0.3989422804014327 * total;
}

function normalcdf(mean: number, sigma: number, to: number) {
  // More accurate:
  if (mean === 0 && sigma === 1) return normsdist(to);

  let x = to;
  const std = sigma;

  x = (x - mean) / std;
  let t = 1 / (1 + 0.2315419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;

  const z = (to - mean) / Math.sqrt(2 * sigma * sigma);
  t = 1 / (1 + 0.3275911 * Math.abs(z));
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  let sign = 1;
  if (z < 0) {
    sign = -1;
  }
  return (1 / 2) * (1 + sign * erf);
}

function black_scholes(
  call: boolean,
  S: number,
  X: number,
  rC: number,
  vC: number,
  t: number,
  dPerYr?: Optional<number>
): number;
function black_scholes(
  call: boolean,
  S: number,
  X: number,
  rC: number,
  vC: number,
  t: number,
  dPerYr: Optional<number>,
  retGreeks: true
): {
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
  price: number;
};
function black_scholes(
  call: boolean,
  S: number,
  X: number,
  rC: number,
  vC: number,
  t: number,
  dPerYr: Optional<number> = undefined,
  retGreeks = false
) {
  const fDPerYr = dPerYr || FINANCE.DFLT_DAYS_PER_YEAR;
  // call = Boolean (to calc call, call=True, put: call=false)
  // S = stock prics, X = strike price,
  // rC = no-risk interest rate as whole percent 1 = 1%
  // vC = volatility (out of 100) (1 std dev of S for (1 yr? 1 month?, you pick)
  // t = time to maturity (decimal representation of year)

  const c44_iv = vC / 100;
  const d44_r = rC / 100;
  const e44_div = 0;
  const a44_So = S;
  const b44_X = X;
  const g44_t = t;
  const sqrtT = Math.sqrt(g44_t);

  const h44_priceNatLog = Math.log(a44_So / b44_X);
  const i44_d1Numerator = (d44_r - e44_div + Math.pow(c44_iv, 2) / 2) * g44_t;
  const j44_d1Denominator = c44_iv * sqrtT;

  const k44_d1 = (h44_priceNatLog + i44_d1Numerator) / j44_d1Denominator;
  const l44_d2 = k44_d1 - j44_d1Denominator;

  const r44_xert = b44_X * Math.exp(-d44_r * g44_t);
  const s44_eqt = Math.exp(-e44_div * g44_t);
  const t44_SoEqt = a44_So * s44_eqt;

  const expNsqrD1d2 = !retGreeks ? 0 : Math.exp((-1 * Math.pow(k44_d1, 2)) / 2);
  const sqrt2Pi = !retGreeks ? 0 : Math.sqrt(2 * Math.PI);

  const w44_gamma = !retGreeks
    ? 0
    : ((expNsqrD1d2 / sqrt2Pi) * s44_eqt) / (a44_So * j44_d1Denominator);
  const y44_vega = !retGreeks
    ? 0
    : ((expNsqrD1d2 / sqrt2Pi) * s44_eqt * a44_So * sqrtT) / 100;

  if (call) {
    const m44_Nd1 = normalcdf(0, 1, k44_d1);
    const o44_Nd2 = normalcdf(0, 1, l44_d2);

    const u44_callPrice = t44_SoEqt * m44_Nd1 - r44_xert * o44_Nd2;

    return !retGreeks
      ? round(u44_callPrice, 4)
      : {
          delta: m44_Nd1 * s44_eqt,
          gamma: w44_gamma,
          theta:
            (-(
              (((a44_So * expNsqrD1d2) / sqrt2Pi) * c44_iv * s44_eqt) /
              (2 * sqrtT)
            ) -
              d44_r * r44_xert * o44_Nd2 +
              e44_div * a44_So * m44_Nd1 * s44_eqt) /
            fDPerYr,
          vega: y44_vega,
          rho: 0,
          price: round(u44_callPrice, 4),
        };
  } else {
    const n44_N_d1 = normalcdf(0, 1, -k44_d1);
    const p44_N_d2 = normalcdf(0, 1, -l44_d2);
    const m44_Nd1 = !retGreeks ? 0 : normalcdf(0, 1, k44_d1);

    const aa44_putPrice = r44_xert * p44_N_d2 - t44_SoEqt * n44_N_d1;

    return !retGreeks
      ? round(aa44_putPrice, 4)
      : {
          delta: (m44_Nd1 - 1) * s44_eqt,
          gamma: w44_gamma,
          theta:
            (-(
              (((a44_So * expNsqrD1d2) / sqrt2Pi) * c44_iv * s44_eqt) /
              (2 * sqrtT)
            ) +
              d44_r * r44_xert * p44_N_d2 -
              e44_div * a44_So * n44_N_d1 * s44_eqt) /
            fDPerYr,
          vega: y44_vega,
          rho: 0,
          price: round(aa44_putPrice, 4),
        };
  }
}

export { black_scholes };

export function find_iv(
  call: boolean,
  S: number,
  X: number,
  rC: number,
  T: number,
  endPrice: number
) {
  // call = Boolean (to calc call, call=True, put: call=false)
  // S = stock prics, X = strike price, r = no-risk interest rate
  // t = time to maturity
  // o = option price
  let ivLowerThan = 3000;
  const ivMaxJump = 25;
  const ivMinJump = 0.01;
  let ivHigherThan = 0;
  let iv = 30;
  let ct = 0;

  let test_ep;
  do {
    ct++;
    test_ep = black_scholes(call, S, X, rC, iv, T);
    if (Math.abs(endPrice - test_ep) < 0.01) {
      // eslint-disable-next-line no-self-assign
      iv = iv;
    } else if (test_ep < endPrice) {
      ivHigherThan = iv;
      iv =
        ivHigherThan +
        Math.max(ivMinJump, Math.min(ivMaxJump, (ivLowerThan - iv) / 2));
    } else {
      ivLowerThan = iv;
      iv =
        ivLowerThan +
        Math.min(-ivMinJump, Math.max(-ivMaxJump, (ivHigherThan - iv) / 2));
    }
  } while (Math.abs(endPrice - test_ep) >= 0.01 && ct < 500);
  if (iv <= 1) iv = 1;
  if (iv >= ivLowerThan) iv = ivLowerThan;

  iv = round(iv, 3);

  return iv;
}
