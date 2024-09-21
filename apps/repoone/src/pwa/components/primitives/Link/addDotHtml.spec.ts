import addDotHtml from './addDotHtml';

describe('pwa/components/primitives/Link/addHtml', () => {
  const fixture = '/my/path';
  const qs = '?code=abc&someCode=zyx';

  test('Adds it plainly', () => {
    const expected = `${fixture}.html`;

    const result: string = addDotHtml(fixture);

    expect(result).toEqual(expected);
  });
  test('Inserts it before querystring', () => {
    const expected = `${fixture}.html${qs}`;

    const result: string = addDotHtml(`${fixture}${qs}`);

    expect(result).toEqual(expected);
  });
});
