import { type t } from "opc-types/lib";

function createConstsStrs(ns: string, consts: Array<string>) {
  const constObj: t.constMap = {};
  consts.forEach((c) => {
    constObj[c] = `${ns}/${c}`;
  });
  return constObj;
}

// todo: allow hashMap / object to come in, basically just prefixes namespace
function createConstsObj(ns: string, consts: Array<string> | Object) {
  const constObj: t.constMap = {};
  // @ts-ignore
  consts.forEach((c: any) => {
    constObj[c] = `${ns}/${c}`;
  });
  return constObj;
}

function createConsts(ns: string, consts: Array<string> | Object) {
  return Array.isArray(consts)
    ? createConstsStrs(ns, consts)
    : createConstsObj(ns, consts);
}

export { createConsts };
