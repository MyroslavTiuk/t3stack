import React, { useEffect, useState } from "react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import RootLayout from "~/components/layout/layout";
import "~/styles/globals.css";
import "~/styles/fullcalendar.css";

import { api } from "~/utils/api";
import AuthCheck from "~/components/layout/authCheck";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { withRedux } from "~/pwa/store/withRedux";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "../pwa/components/core/Loading";
import * as CalculatorSession from "../pwa/components/modules/Session/SessionProvider";
import CalculationsProvider from "../services/UserData/CalculationsProvider";
import ToastProvider from "../pwa/components/primitives/ToastNotification/ToastNotificationProvider";
import { useRouter } from "next/router";
import initAnalyticsOnRouteChange from "../services/Analytics/initOnRouteChange";
import initExperiments from "../services/Experiments/initExperiments";
import resetAds from "../services/Ads/resetAds";
import ResizeProvider from "../pwa/components/modules/ResizeProvider";
import { OptionFinderProvider } from "../pwa/components/modules/OptionFinder/OptionFinderContext";
import { getOrCreateStore } from "../pwa/store/withRedux";
import { Component, type ErrorInfo, type ReactNode } from "react";
import Calculator from "./calculator";
import Home from "./finder";
import { type AnyAction, type Store as ReduxStore } from "redux";
import { type Persistor } from "redux-persist";
import { type Store as StoreType } from "opc-types/lib/store/Store";
import { Raleway } from "next/font/google";

export const AdRefreshContext = React.createContext({ refreshTime: 0 });

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error, _: ErrorInfo) {
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const MyApp: AppType<{ session: Session | null; initialReduxStore: any }> = ({
  Component,
  pageProps: { session, initialReduxStore, ...pageProps },
}) => {
  const [adRefreshTime, setAdRefreshTime] = React.useState(Date.now());
  const router = useRouter();
  const [isReduxInitialized, setIsReduxInitialized] = useState(false);
  const [store, setStore] = useState<ReduxStore<StoreType, AnyAction> | null>(
    () => null
  );
  const [persistor, setPersistor] = useState<Persistor | null>(null);

  useEffect(() => {
    const initializeRedux = async () => {
      const { store: initializedStore, persistor: initializedPersistor } =
        getOrCreateStore(initialReduxStore);
      setStore(initializedStore);
      setPersistor(initializedPersistor);
      setIsReduxInitialized(true);
    };

    initializeRedux();
  }, []);

  // useEffect(() => {

  //     // Example: Redirect based on user session
  //     if (Component === Calculator || Component === Home) {
  //       const shouldRedirect = session?.user.id;
  //       if (shouldRedirect) {
  //         router.push("/");
  //       }
  //     }

  // }, [isReduxInitialized, Component, session, router]);

  React.useEffect(function appInitialisation() {
    if (Component === Calculator || Component === Home) {
      // Set segment dimensions
      initExperiments();

      // Set up analytics
      const analyticsRouteChangeCb = initAnalyticsOnRouteChange();

      // Listen for route changes
      const handleRouteChange = (url: string) => {
        analyticsRouteChangeCb(url);
        resetAds(url, setAdRefreshTime);
      };
      router.events.on("routeChangeStart", handleRouteChange);
      return () => {
        router.events.off("routeChangeStart", handleRouteChange);
      };
    }
  }, []);

  // const { store, persistor } = React.useMemo(
  //   () => {
  //     if (Component === Calculator || Component === Home) {
  //       return getOrCreateStore(initialReduxStore);
  //     }

  //     return {
  //       store: undefined,
  //       persistor: undefined,
  //     };
  //   },
  //   // () => props.reduxStore,
  //   [initialReduxStore]
  // );

  if (!isReduxInitialized) {
    return <Loading />;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <div className={raleway.className}>
      <ErrorBoundary>
        <SessionProvider session={session}>
          {store && persistor && (
            <Provider store={store}>
              <ResizeProvider>
                <ToastProvider>
                  <CalculatorSession.default>
                    <AdRefreshContext.Provider
                      value={{ refreshTime: adRefreshTime }}
                    >
                      <CalculationsProvider>
                        <OptionFinderProvider>
                          <PersistGate loading={null} persistor={persistor}>
                            <RootLayout>
                              <Loading />
                              <AuthCheck>
                                <ToastContainer />
                                <Component {...pageProps} />
                              </AuthCheck>
                            </RootLayout>
                          </PersistGate>
                        </OptionFinderProvider>
                      </CalculationsProvider>
                    </AdRefreshContext.Provider>
                  </CalculatorSession.default>
                </ToastProvider>
              </ResizeProvider>
            </Provider>
          )}
        </SessionProvider>
      </ErrorBoundary>
    </div>
  );
};

export default withRedux(api.withTRPC(MyApp));
