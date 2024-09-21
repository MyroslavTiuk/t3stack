import round from './round';

describe('utils/Data/round/round', () => {
  test('rounds down whole', () => {
    const expected = 1;

    const result: number = round(1.4);

    expect(result).toEqual(expected);
  });

  test('rounds down to one decimal place', () => {
    const expected = 1.4;

    const result: number = round(1.44, 1);

    expect(result).toEqual(expected);
  });

  test('rounds up whole', () => {
    const expected = 2;

    const result: number = round(1.5);

    expect(result).toEqual(expected);
  });

  test('rounds up to one decimal place', () => {
    const expected = 1.5;

    const result: number = round(1.46, 1);

    expect(result).toEqual(expected);
  });

  test('rounds up when preferenceDownForHalf not specified', () => {
    const expected = 0.1;

    const result: number = round(0.095, 2);

    expect(result).toEqual(expected);
  });
  test('rounds down when preferenceDownForHalf specified', () => {
    const expected = 0.09;

    const result: number = round(0.095, 2, { preferenceDownForHalf: true });

    expect(result).toEqual(expected);
  });
});
