import emitter from 'react-ab-test/lib/emitter';
import { EXPERIMENTS } from '../../../../../services/Experiments/experiments';
import { getCookie } from '../../../../../utils/Html/cookies';

const getExperiments = () => {
  // @ts-ignore
  if (typeof window !== 'undefined' && typeof emitter !== 'undefined') {
    const expPairs = [
      [
        EXPERIMENTS.POPULAR_STRAT_BUTTONS,
        emitter.getActiveVariant(EXPERIMENTS.POPULAR_STRAT_BUTTONS),
      ],
      [
        EXPERIMENTS.HOME_HEADER,
        emitter.getActiveVariant(EXPERIMENTS.HOME_HEADER),
      ],
      [
        EXPERIMENTS.PREVIOUS_USER_LAYOUT,
        getCookie(`EXP_${EXPERIMENTS.PREVIOUS_USER_LAYOUT}`),
      ],
    ] as [string, string][];
    return expPairs.map((pair) => `${pair[0]}: ${pair[1]}`);
  }
  return [];
};

export default getExperiments;
