import fixCommonSymbolMistakes from './fixCommonSymbolMistakes';

describe('fixCommonSymbolMistakes', () => {
  const expected = 'XYZ';

  test('Strips ,', () => {
    expect(fixCommonSymbolMistakes(',XYZ')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XY,Z')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XYZ,')).toEqual(expected);
  });
  test('Strips \\', () => {
    expect(fixCommonSymbolMistakes('\\XYZ')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XY\\Z')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XYZ\\')).toEqual(expected);
  });
  test('Strips /', () => {
    expect(fixCommonSymbolMistakes('/XYZ')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XY/Z')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XYZ/')).toEqual(expected);
  });
  test('Strips multiple', () => {
    expect(fixCommonSymbolMistakes('/,XY[Z`')).toEqual(expected);
  });
  test('Trims whitespace', () => {
    expect(fixCommonSymbolMistakes(' XYZ')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XY Z')).toEqual(expected);
    expect(fixCommonSymbolMistakes('XYZ ')).toEqual(expected);
  });
});
