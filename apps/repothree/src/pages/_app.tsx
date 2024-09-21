import React from "react";
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

const MyApp: AppType<{ session: Session | null }> = ({
  // eslint does not correctly infer the type here and complains
  // eslint-disable-next-line react/prop-types
  Component,
  // eslint-disable-next-line react/prop-types
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <RootLayout>
        <AuthCheck>
          <ToastContainer />
          <Component {...pageProps} />
        </AuthCheck>
      </RootLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
