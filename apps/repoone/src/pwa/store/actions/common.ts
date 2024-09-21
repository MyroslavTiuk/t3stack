import presetActions from '../../../utils/Redux/presetActions/presetActions';
import { makeCreateActions } from '../../../utils/Redux';

const commonActions = makeCreateActions('COMMON')({
  reset: presetActions.noPayload,
});

export default commonActions;
