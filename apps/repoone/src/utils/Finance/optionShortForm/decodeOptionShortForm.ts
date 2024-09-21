import parseInt10 from "../../../utils/Maths/parseInt10";

const decodeOptionShortForm = (shortForm: string) => {
  const sfSplit = shortForm.split(":");
  const stock = sfSplit.length === 2 ? sfSplit[0] : undefined;
  const legsShortForm = sfSplit.length === 2 ? sfSplit[1] : sfSplit[0];

  const individualLegsShortForm = legsShortForm.split(",");

  const legs = individualLegsShortForm.map((legShortForm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, actShort, , numRaw, expiryRaw, opTypeShort, strikeRaw, priceRaw] =
      /^([bs]?)((\d*?)x)?(\d*?)([pc])([\d.]+)@?([\d.]*)$/.exec(legShortForm);

    const num = numRaw ? parseInt10(numRaw) : 1;
    const expiry = expiryRaw;
    const opType: "put" | "call" | undefined =
      opTypeShort === "p" ? "put" : opTypeShort === "c" ? "call" : undefined;
    const act: "buy" | "sell" | undefined =
      actShort === "b" ? "buy" : actShort === "s" ? "sell" : undefined;
    const strike = parseFloat(strikeRaw);
    const price = priceRaw ? parseFloat(priceRaw) : undefined;

    if (num !== undefined && isNaN(num)) {
      throw Error(
        "Error while trying to find number of contracts from short-form option code"
      );
    }
    if (strike !== undefined && isNaN(strike)) {
      throw Error(
        "Error while trying to find strike from short-form option code"
      );
    }
    if (price !== undefined && isNaN(price)) {
      throw Error(
        "Error while trying to find price from short-form option code"
      );
    }

    return {
      num,
      expiry,
      opType,
      strike,
      price,
      act,
    };
  });

  return {
    stock: stock || undefined,
    legs,
  };
};

export default decodeOptionShortForm;
