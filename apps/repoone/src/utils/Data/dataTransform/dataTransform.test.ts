// import { P, Pronad, PND_RIGHT } from "pronad";
import { fill, callWithKey } from "./dataTransform";

type TestObj = {
  one?: string;
  two?: string;
  three?: string;
};

describe("utils/dataTransform:fill", () => {
  test("adds default args", () => {
    const oldObj: TestObj = { one: "1", two: "2" };
    const newObj: TestObj = { two: "2-new", three: "3-new" };

    const combined: TestObj = fill(oldObj, newObj);

    expect(combined.one).toBe("1");
    expect(combined.two).toBe("2");
    expect(combined.three).toBe("3-new");
  });
});

describe("utils/dataTransform:callWithKey", () => {
  test("calls function with expected value", () => {
    const fixObj: TestObj = { one: "1", two: "2" };
    const fixture = {};
    const fn: (v: string | undefined) => {} = jest
      .fn()
      .mockImplementationOnce(() => fixture);

    const newFn = callWithKey("two");

    const result = newFn(fn)(fixObj);

    expect(result).toBe(fixture);
    expect(fn).toHaveBeenCalledWith("2");
  });
});

// describe("utils/dataTransform:accResultFlat", () => {
//   const oldObj: TestObj = { one: "1", two: "2" };
//   const assignKey = "three";
//   const pickKey: string = "one";

//   test("adds to object in success", (done) => {
//     const fn: (a: TestObj) => Pronad<never, string> = jest.fn().mockImplementationOnce((param: TestObj) => P.Right(`${param.two}-3`));
//     const actual: Pronad<never, TestObj> = accResultFlat({ assignKey }, fn)(oldObj);

//     actual.tap((r: TestObj) => {
//       expect(r.one).toBe("1");
//       expect(r.two).toBe("2");
//       expect(r.three).toBe("2-3");
//       done();
//     });
//   });

//   test("nones out in failure case", (done) => {
//     const fn: (a: TestObj) => Pronad<void, never> = jest.fn().mockImplementationOnce((param: TestObj) => P.Left(null));

//     const actual: Pronad<void, TestObj> = accResultFlat({ assignKey }, fn)(oldObj);

//     actual.doubleTap((l: void, r: never, isRight: boolean) => {
//       expect(isRight).toBe(false);
//       expect(l).toBeNull();
//       done();
//     });
//   });

//   test("picks key if given", (done) => {
//     const fn: (a: TestObj) => Pronad<never, string> = jest.fn().mockImplementationOnce(() => P.Right(`blerg`));
//     const actual: Pronad<never, TestObj> = accResultFlat({ pickKey }, fn)(oldObj);

//     actual.tap((r: TestObj) => {
//       expect(fn).toHaveBeenCalledWith("one");
//       done();
//     });
//   });
// });
