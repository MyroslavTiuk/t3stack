import objectEntries from './objectEntries';

describe('utils/Data/objectEntries/objectEntries', () => {
  const fixture = {
    a: 'A',
    b: 'B',
  };

  test('Returns set of entries', () => {
    const expected = [
      ['a', 'A'],
      ['b', 'B'],
    ];

    const result = objectEntries(fixture);

    expect(result).toEqual(expected);
  });
});
