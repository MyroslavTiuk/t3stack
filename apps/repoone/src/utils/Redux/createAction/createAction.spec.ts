import { makeCreateAction } from './createAction';
import { presetActions } from '..';

describe('utils/ReduxUtils/makeCreateAction', () => {
  const namespace = 'NAMESPACE';

  const createTestAction = makeCreateAction(namespace);

  const fixture = {};

  test('should accept single param to create function', () => {
    expect(typeof createTestAction).toBe('function');
  });

  describe('identity actionCreator', () => {
    const testAction = createTestAction(
      'ID_TEST',
      presetActions.makeIdentity(),
    );

    test('returns action id and actionCreator', () => {
      expect(testAction.toString()).toEqual('NAMESPACE/ID_TEST');
      expect(typeof testAction).toEqual('function');
    });

    test('called creates expected action', () => {
      const action = testAction(fixture);

      expect(action).toEqual({ type: 'NAMESPACE/ID_TEST', payload: fixture });
    });
  });

  describe('void actionCreator', () => {
    const testAction = createTestAction('VOID_TEST', presetActions.noPayload);

    test('returns action id and actionCreator', () => {
      expect(testAction.toString()).toEqual('NAMESPACE/VOID_TEST');
      expect(typeof testAction).toEqual('function');
    });

    test('called creates expected action', () => {
      const action = testAction();

      expect(action).toEqual({
        type: 'NAMESPACE/VOID_TEST',
        payload: undefined,
      });
    });
  });
});
