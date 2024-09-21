import sanitizeObjectForUndefined from './sanitizeObjectForUndefined';

describe('sanitizeObjectForUndefined', () => {
  it('should return a sanitized object where undefined will be replace by the passed placeholder', () => {
    const testData = {
      id: '1',
      fieldA: undefined,
      arrayField: [
        {
          name: 'test',
          otherField: undefined,
        },
      ],
      nestedObject: {
        fieldB: undefined,
        fieldC: 'value not undefined',
      },
    };
    const result = sanitizeObjectForUndefined(testData, 'my placeholder');

    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        id: '1',
        fieldA: 'my placeholder',
        arrayField: [
          {
            name: 'test',
            otherField: 'my placeholder',
          },
        ],
        nestedObject: {
          fieldB: 'my placeholder',
          fieldC: 'value not undefined',
        },
      }),
    );
  });

  it('should default the value to null if placeholder is not passed in the params', () => {
    const testData = {
      id: '1',
      fieldA: undefined,
      arrayField: [
        {
          name: 'test',
          otherField: undefined,
        },
      ],
      nestedObject: {
        fieldB: undefined,
        fieldC: 'value not undefined',
      },
    };
    const result = sanitizeObjectForUndefined(testData);

    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        id: '1',
        fieldA: null,
        arrayField: [
          {
            name: 'test',
            otherField: null,
          },
        ],
        nestedObject: {
          fieldB: null,
          fieldC: 'value not undefined',
        },
      }),
    );
  });
});
