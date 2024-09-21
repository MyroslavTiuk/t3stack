import objectFromEntries from './objectFromEntries';

describe('utils/Data/objectFromEntries/objectFromEntries', () => {
  const fixture: [string, string][] = [
    ['a', 'A'],
    ['b', 'B'],
  ];

  test('Returns set of entries', () => {
    const expected = {
      a: 'A',
      b: 'B',
    };

    const result = objectFromEntries(fixture);

    expect(result).toEqual(expected);
  });
});
