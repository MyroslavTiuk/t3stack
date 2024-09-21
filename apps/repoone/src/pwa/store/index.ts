import {
  applyMiddleware,
  compose,
  createStore,
  type Reducer,
  // Middleware,
  type StoreEnhancer,
  type Store as ReduxStore,
  type AnyAction,
} from "redux";
import { createMiddleware as createListenerMiddlware } from "redux-listeners";

import { composeWithDevTools } from "redux-devtools-extension";
import {
  persistCombineReducers,
  persistStore,
  type PersistConfig,
  type Persistor,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import promise from "redux-promise-middleware";
// import thunk from 'redux-thunk';
import { type Store } from "opc-types/lib/store/Store";
import reducers from "./reducers";
import ENV from "../../config/Env";
import initListeners from "./listeners/initListeners";

const initStore = (initialState?: Store) => {
  const persistConfig: PersistConfig<{
    key: string;
    storage: Store;
    whitelist: string[];
  }> = {
    key: "root",
    storage,
    whitelist: ["userSettings"],
  };

  const combinedReducer: Reducer = persistCombineReducers(
    persistConfig,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    {
      ...reducers,
      // location: router.reducer,
    }
  );

  const listenerMiddleware = createListenerMiddlware();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const middlewareEnhancer: Function = applyMiddleware(
    // router.middleware,
    listenerMiddleware,
    // thunk,
    promise
  );

  initListeners(listenerMiddleware);

  const composedEnhancers: StoreEnhancer = (
    ENV.ENABLE_DEBUG ? composeWithDevTools : compose
  )(
    // router.enhancer,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    middlewareEnhancer
  );

  const store: ReduxStore<Store, AnyAction> = createStore<
    Store,
    AnyAction,
    NonNullable<unknown>,
    unknown
  >(combinedReducer, initialState, composedEnhancers);

  const persistor: Persistor = persistStore(store, undefined, () => {
    // if (router.initialDispatch !== undefined) router.initialDispatch();
  });
  return { store, persistor };
};

export default initStore;
