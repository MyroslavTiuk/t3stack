import React from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { type AppProps } from "next/app";
import { theme } from "@styles/theme";
import { AppBar, headerHeight } from "src/components/layout/AppBar/AppBar";
import { trpc } from "@utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutContextProvider } from "@context/layoutContext";
import { Meta } from "@atoms/Meta";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import Script from "next/script";
import Footer from "src/components/layout/footer/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});

const MyApp: React.FC<AppProps<{ session: Session | null }>> = ({
  Component,
  pageProps,
}) => {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <LayoutContextProvider>
            <GoogleAnalyticsScripts />
            <Meta />
            <Box minHeight="80vh">
              <Box>
                <AppBar />
                <main>
                  <Box mt={headerHeight}>
                    <Component {...pageProps} />
                  </Box>
                </main>
              </Box>
              <Footer />
            </Box>
          </LayoutContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};

const GoogleAnalyticsScripts: React.FC = () => {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-KXQ460YTNR"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-KXQ460YTNR');
  `}
      </Script>
    </>
  );
};

export default trpc.withTRPC(MyApp);
