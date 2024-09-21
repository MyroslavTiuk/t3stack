import { findInflections } from './findInflections';

describe('summary-inflections', () => {
  const fixPricePoints = [0, 20, 40, 50, 60, 70, 600];
  test('finds 0-40', () => {
    const expected = [[0, 40]];

    const actual = findInflections([0, 20, 40], fixPricePoints, 600);

    expect(actual).toEqual(expected);
  });
  test('finds 60-Inf', () => {
    const expected = [[60, Infinity]];

    const actual = findInflections([60, 70, 600], fixPricePoints, 600);

    expect(actual).toEqual(expected);
  });
  test('finds 40-60', () => {
    const expected = [[40, 60]];

    const actual = findInflections([40, 50, 60], fixPricePoints, 600);

    expect(actual).toEqual(expected);
  });
  test('finds multiple', () => {
    const expected = [
      [0, 40],
      [60, 70],
    ];

    const actual = findInflections([0, 20, 40, 60, 70], fixPricePoints, 600);

    expect(actual).toEqual(expected);
  });
  test('for good measure1', () => {
    const expected = [
      [0, 20],
      [50, 50],
      [70, Infinity],
    ];

    const actual = findInflections([0, 20, 50, 70, 600], fixPricePoints, 600);

    expect(actual).toEqual(expected);
  });
  test('for good measure2', () => {
    const expected = [
      [0, 0],
      [40, 40],
      [70, Infinity],
    ];

    const actual = findInflections([0, 40, 70, 600], fixPricePoints, 600);

    expect(actual).toEqual(expected);
  });
});
