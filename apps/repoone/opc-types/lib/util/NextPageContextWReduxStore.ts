import { NextPageContext } from 'next';
import { Store } from 'redux';

export type NextPageContextWReduxStore = NextPageContext & {
  reduxStore: Store;
};
