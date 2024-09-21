import { type ExpiryChoice } from "../OptionLeg/OptionLeg.props";

const defaultGetExpiryItemValue = (expiryChoice: ExpiryChoice) =>
  expiryChoice?.date || "";

const makeGetExpiryItemValue = () => defaultGetExpiryItemValue;

export default makeGetExpiryItemValue;
