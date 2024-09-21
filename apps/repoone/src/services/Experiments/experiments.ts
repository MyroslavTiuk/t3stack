export enum EXPERIMENTS {
  HOME_HEADER = 'home_header',
  POPULAR_STRAT_BUTTONS = 'popular_strat_buttons',
  LAYOUT = 'layout',
  PREVIOUS_USER_LAYOUT = 'previous_user',
}

export const VARIANTS = {
  [EXPERIMENTS.HOME_HEADER]: [
    ['full', 'short', 'none'],
    // weightings
  ],
  [EXPERIMENTS.POPULAR_STRAT_BUTTONS]: [
    ['quick_strats', 'all_strats_only'],
    // weightings
  ],
  [EXPERIMENTS.PREVIOUS_USER_LAYOUT]: [
    ['SBS_NEWUSER', 'SBS_RETURNER', 'STACKED_NEWUSER', 'STACKED_RETURNER'],
  ],
};

export const EXP_DIMENSIONS = {
  [EXPERIMENTS.HOME_HEADER]: 'dimension1',
  [EXPERIMENTS.POPULAR_STRAT_BUTTONS]: 'dimension2',
  [EXPERIMENTS.LAYOUT]: 'dimension3',
  [EXPERIMENTS.PREVIOUS_USER_LAYOUT]: 'dimension4',
};
