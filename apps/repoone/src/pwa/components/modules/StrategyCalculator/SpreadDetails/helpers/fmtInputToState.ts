import { type SpreadDetailsState } from "../SpreadDetails.props";
import { expToCode } from "../../../../../../utils/String/DateFormat/DateFormat";

const fmtInputToState = (key: keyof SpreadDetailsState) => {
  switch (key) {
    case "num":
    case "strike":
      return (val: string) => parseFloat(val.replace(",", "")) || null;

    case "expiry":
      return (val: string) => (!val ? null : expToCode(val));

    // case 'act':
    case "opType":
      return (val: string) => (val || "").toLowerCase() || null;

    default:
      return (val: any) => val;
  }
};

export default fmtInputToState;
