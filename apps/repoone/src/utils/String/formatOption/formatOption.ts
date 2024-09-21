// @ts-nocheck

import { format, isFuture } from "date-fns";

import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import formatPrice from "../formatPrice/formatPrice";

const formatOption = (opt: Partial<StratLegOpt>, today = new Date()) => {
  // todo: log errors
  try {
    if (!opt.expiry || !opt.strike || !opt.opType) return null;
    const expDate = new Date(
      Number(opt.expiry.substr(0, 4)),
      Number(opt.expiry.substr(4, 2)) - 1,
      Number(opt.expiry.substr(6, 2))
    );
    if (expDate.getTime() < 946645200000)
      throw new Error("Expiry date before 2000/01/01");
    const showYear =
      !isFuture(expDate) ||
      (expDate.getTime() - today.getTime() > 90 &&
        expDate.getFullYear() - today.getFullYear() > 0);

    return `${format(expDate, "do LLL")}${
      showYear ? ` ${format(expDate, "yy")}` : ""
    } ${formatPrice(opt.strike)} ${opt.opType.toLowerCase()}`;
  } catch (e) {
    return null;
  }
};

export default formatOption;
