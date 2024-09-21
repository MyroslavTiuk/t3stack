import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

const fixCommonSymbolMistakes = (sym: string) => {
  const fixed = sym
    .trim()
    .toUpperCase()
    .replace(/[ [\]'`=;\\/,&:]/gi, "");
  return (
    (
      {
        ".DJI": ".DJX",
        RUT: ".RUT",
        ".SPX": "SPX",
      } as ObjRecord<string>
    )[fixed] || fixed
  );
};

export default fixCommonSymbolMistakes;
