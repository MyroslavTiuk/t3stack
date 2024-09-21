import ensureEnvVarExists from '../utils/Data/ensureEnvVarExists';
import Env from './Env';

if (!Env.IS_TEST) {
  ensureEnvVarExists(['ga_tracking_id'], {
    ga_tracking_id: process.env.ga_tracking_id,
  });
}

export const ANALYTICS = {
  GA_TRACKING_ID: process?.env?.ga_tracking_id,
  ENABLE_TRACKING: process?.env?.ga_track_in_dev || Env.IS_PROD,
  HOTJAR_ID: process?.env?.hotjar_id || null,
};
