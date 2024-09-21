// This was created from a tutorial on macro options

// todo: Replace with better Normal Cumulative Distribution function
import { FINANCE } from '../../config/Finance';

function normalcdf(mean, sigma, to) {
  var z = (to - mean) / Math.sqrt(2 * sigma * sigma);
  var t = 1 / (1 + 0.3275911 * Math.abs(z));
  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  var sign = 1;
  if (z < 0) {
    sign = -1;
  }
  return (1 / 2) * (1 + sign * erf);
}

// function cdfNormal (x, mean, standardDeviation) {
//  return (1 - mathjs.erf((mean - x ) / (Math.sqrt(2) * standardDeviation))) / 2
// }

const daysPerYr = FINANCE.DFLT_DAYS_PER_YEAR;
const a44_So = 304.16; //36.07;
const b44_X = 270; //35;
const c44_iv = 38 / 100; //48.25 / 100;
const d44_r = 0.3 / 100;
const e44_div = 0;
const g44_t = 11 / daysPerYr;

const h44_priceNatLog = Math.log(a44_So / b44_X);
const i44_d1Numerator = (d44_r - e44_div + Math.pow(c44_iv, 2) / 2) * g44_t;
const j44_d1Denominator = c44_iv * Math.sqrt(g44_t);

const k44_d1 = (h44_priceNatLog + i44_d1Numerator) / j44_d1Denominator;
const l44_d2 = k44_d1 - j44_d1Denominator;

const m44_Nd1 = normalcdf(0, 1, k44_d1);
const n44_N_d1 = normalcdf(0, 1, -k44_d1); // !
const o44_Nd2 = normalcdf(0, 1, l44_d2); // !
const p44_N_d2 = normalcdf(0, 1, -l44_d2); // !
const q44_ert = Math.exp(-d44_r * g44_t);
const r44_xert = b44_X * q44_ert;
const s44_eqt = Math.exp(-e44_div * g44_t);
const t44_SoEqt = a44_So * s44_eqt;

const u44_callPrice = t44_SoEqt * m44_Nd1 - r44_xert * o44_Nd2;
const v44_callDelta = m44_Nd1 * s44_eqt;
const w44_callGamma =
  ((Math.exp((-1 * Math.pow(k44_d1, 2)) / 2) / Math.sqrt(2 * Math.PI)) *
    s44_eqt) /
  (a44_So * j44_d1Denominator);
const x44_callTheta =
  (-(
    (((a44_So * Math.exp((-1 * Math.pow(k44_d1, 2)) / 2)) /
      Math.sqrt(2 * Math.PI)) *
      c44_iv *
      s44_eqt) /
    (2 * Math.sqrt(g44_t))
  ) -
    d44_r * r44_xert * o44_Nd2 +
    e44_div * a44_So * m44_Nd1 * s44_eqt) /
  daysPerYr;

const aa44_putPrice = r44_xert * p44_N_d2 - t44_SoEqt * n44_N_d1;
const ab44_putDelta = (m44_Nd1 - 1) * s44_eqt;
const w44_putGamma =
  ((Math.exp((-1 * Math.pow(k44_d1, 2)) / 2) / Math.sqrt(2 * Math.PI)) *
    s44_eqt) /
  (a44_So * j44_d1Denominator);
const x44_putTheta =
  (-(
    (((a44_So * Math.exp((-1 * Math.pow(k44_d1, 2)) / 2)) /
      Math.sqrt(2 * Math.PI)) *
      c44_iv *
      s44_eqt) /
    (2 * Math.sqrt(g44_t))
  ) +
    d44_r * r44_xert * p44_N_d2 -
    e44_div * a44_So * n44_N_d1 * s44_eqt) /
  daysPerYr;

console.log(
  {
    u44_callPrice,
    v44_callDelta,
    w44_callGamma,
    x44_callTheta,
  },
  {
    aa44_putPrice,
    ab44_putDelta,
    w44_putGamma,
    x44_putTheta,
    g44_t,
  },
);
