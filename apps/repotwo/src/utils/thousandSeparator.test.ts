import { thousandSeparator } from "./thousandSeparator";

describe("thousandSeparator", () => {
  it("without thousand with number", () => {
    const result = thousandSeparator(123);

    expect(result).toBe("123");
  });

  it("without thousand with string", () => {
    const result = thousandSeparator("123");

    expect(result).toBe("123");
  });

  it("without thousand with decimal for number", () => {
    const result = thousandSeparator(123.02);

    expect(result).toBe("123.02");
  });

  it("without thousand with decimal for string", () => {
    const result = thousandSeparator("123.02");

    expect(result).toBe("123.02");
  });

  it("with one comma thousand for number", () => {
    const result = thousandSeparator(1231);

    expect(result).toBe("1,231");
  });

  it("with one comma thousand for string", () => {
    const result = thousandSeparator(1231);

    expect(result).toBe("1,231");
  });

  it("with one comma thousand for decimal number", () => {
    const result = thousandSeparator(1231.02);

    expect(result).toBe("1,231.02");
  });

  it("with one comma thousand for decimal string", () => {
    const result = thousandSeparator("1231.02");

    expect(result).toBe("1,231.02");
  });

  it("with two comma thousand for  number", () => {
    const result = thousandSeparator(12310200);

    expect(result).toBe("12,310,200");
  });

  it("with two comma thousand for  string", () => {
    const result = thousandSeparator(12310200);

    expect(result).toBe("12,310,200");
  });
});
