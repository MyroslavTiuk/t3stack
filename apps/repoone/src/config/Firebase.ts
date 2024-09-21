import ensureEnvVarExists from '../utils/Data/ensureEnvVarExists';
import Env from './Env';

if (!Env.IS_TEST) {
  ensureEnvVarExists(['firebase_config'], {
    firebase_config: process.env.firebase_config,
  });
}

export const FIREBASE = {
  CONFIG: process?.env?.firebase_config || {},
};
