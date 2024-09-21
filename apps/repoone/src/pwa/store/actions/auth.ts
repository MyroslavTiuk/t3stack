import { makeCreateActions, presetActions } from '../../../utils/Redux';

const ns = 'AUTH';
const createAuthActions = makeCreateActions(ns);

const authActions = createAuthActions({
  newRegistrationSuccess: presetActions.noPayload,
  authenticated: presetActions.noPayload,
  login: presetActions.noPayload,
  logout: presetActions.noPayload,
});

export default authActions;
