import { type constMap } from "opc-types/lib/constMap";
import { createConsts } from "./createConsts";

describe("utils/infrastructure/createConsts", () => {
  test("create consts", () => {
    const consts: constMap = createConsts("MYNS", ["FIRSTCONST", "MYCONST"]);

    expect(consts.MYCONST).toBe("MYNS/MYCONST");
  });
});
