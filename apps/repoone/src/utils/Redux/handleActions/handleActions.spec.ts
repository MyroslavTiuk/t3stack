import handleActions, { handleActionReducer } from "./handleActions";

type State = { a: number };

const testActionCreator1 = (n: number) => ({ type: "TEST_AC_1", payload: n });
testActionCreator1.toString = () => "TEST_AC_1";
const testActionCreator2 = () => ({ type: "TEST_AC_2", payload: undefined });
testActionCreator2.toString = () => "TEST_AC_2";

describe("utils/Redux/handleActions", () => {
  const reducers = [
    handleActionReducer(testActionCreator1, (state: State, payload) => ({
      a: payload,
    })),
    handleActionReducer(testActionCreator2, () => ({
      a: 0,
    })),
  ];
  test("Reduces as expected setter", () => {
    const expected = 5;

    const actualReducer = handleActions(reducers, { a: 0 });

    const actual = actualReducer({ a: 0 }, { type: "TEST_AC_1", payload: 5 });

    expect(actual.a).toEqual(expected);
  });
  test("Reduces as expected resetter", () => {
    const expected = 0;

    const actualReducer = handleActions(reducers, { a: 2 });

    const actual = actualReducer(
      { a: 3 },
      { type: "TEST_AC_2", payload: undefined }
    );

    expect(actual.a).toEqual(expected);
  });
});
