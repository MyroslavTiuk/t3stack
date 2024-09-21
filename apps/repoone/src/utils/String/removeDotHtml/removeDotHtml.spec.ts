import removeDotHtml from "./removeDotHtml";

describe("utils/String/removeDotHtml", () => {
  test("Removes .html", () => {
    const expected = "test-string";

    const result: string = removeDotHtml("test-string.html");

    expect(result).toEqual(expected);
  });

  test("Does not affect others", () => {
    const expected = "test-string.jpg";

    const result: string = removeDotHtml(expected);

    expect(result).toEqual(expected);
  });

  test("Ok with undefined", () => {
    const expected = undefined;

    const result: string | undefined = removeDotHtml(expected);

    expect(result).toEqual(expected);
  });
});
