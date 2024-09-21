import React from "react";
import { type AnyAction, type Store as ReduxStore } from "redux";
import { type Persistor } from "redux-persist";

import initStore from "./index";
import { type Store as StoreType } from "opc-types/lib/store/Store";

let window: NonNullable<unknown>;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isServer = typeof window === "undefined";
let reduxStore: ReduxStore;
let reduxPersistor: Persistor;

export function getOrCreateStore(initialState?: StoreType): {
  store: ReduxStore<StoreType, AnyAction>;
  persistor: Persistor;
} {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    const { store, persistor } = initStore(initialState);
    reduxPersistor = persistor;
    return { store, persistor };
  }

  // Create store if unavailable on the client and set it on the window object
  if (!reduxStore) {
    const { store, persistor } = initStore(initialState);
    reduxPersistor = persistor;
    reduxStore = store;
  }
  return {
    store: reduxStore as ReduxStore<StoreType, AnyAction>,
    persistor: reduxPersistor,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const withRedux = (AppComp: any) => {
  function AppWithRedux(props: any) {
    const { store, persistor } = React.useMemo(
      () => getOrCreateStore(props.initialReduxStore),
      // () => props.reduxStore,
      [props.initialReduxStore]
    );

    return (
      store && (
        <AppComp {...props} reduxStore={store} reduxPersistor={persistor} />
      )
    );
  }

  return AppWithRedux;
};
