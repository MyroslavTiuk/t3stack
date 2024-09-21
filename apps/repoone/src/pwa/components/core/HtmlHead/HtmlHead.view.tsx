import React, { type FC, type ReactElement } from "react";
import Head from "next/head";

import { SITE } from "../../../../config/Site";

import { type HtmlHeadProps } from "./HtmlHead.props";
import { ANALYTICS } from "../../../../config/Analytics";
import {
  EXP_DIMENSIONS,
  EXPERIMENTS,
} from "../../../../services/Experiments/experiments";

const META_DEFAULTS = Object.freeze({
  title: "Options profit calculator",
  keywords:
    "Options calculator, profit calculator, stock options, stock options calculator, options tool, share options, roi",
  description:
    "Free stock-option profit calculation tool. See visualisations of a strategy's return on investment by possible future stock prices.  Calculate the value of a call or put option or multi-option strategies.",
  image: `${SITE.STATIC_URI}/images/opc-sqr.jpg`,
  canonicalLink: "https://www.optionsprofitcalculator.com/",
});

const HtmlHeadView: FC<HtmlHeadProps> = ({
  title = META_DEFAULTS.title,
  metaKeywords = META_DEFAULTS.keywords,
  metaDescription = META_DEFAULTS.description,
  metaImage = META_DEFAULTS.image,
  canonicalLink = META_DEFAULTS.canonicalLink,
}: HtmlHeadProps): ReactElement<"div"> => {
  return (
    <Head>
      <title key="htmlTitle">{title}</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${SITE.STATIC_URI}/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${SITE.STATIC_URI}/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${SITE.STATIC_URI}/favicon-16x16.png`}
      />
      <link
        rel="shortcut icon"
        href={`${SITE.STATIC_URI}/favicon.ico`}
        type="image/x-icon"
      />
      <link rel="canonical" href={canonicalLink}></link>
      <link rel="manifest" href={`${SITE.STATIC_URI}/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${SITE.STATIC_URI}/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#352E3F" />
      <meta
        name="msapplication-TileImage"
        content={`${SITE.STATIC_URI}/images/app-icon/ms-icon-144x144.png`}
      />
      <meta name="theme-color" content="#352E3F" />
      <link
        href="https://fonts.googleapis.com/css?family=Lato:300,400,500,600,700,900|Raleway:300,400,600,700&display=swap"
        rel="stylesheet"
      />
      {/*<link*/}
      {/*    href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"*/}
      {/*    rel="stylesheet"/>*/}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta httpEquiv="cleartype" content="on" />
      <meta content={metaKeywords} name="keywords" />
      <meta content={metaDescription} name="description" />
      <meta content="index,follow" name="robots" />
      <meta itemProp="name" content="Options profit calculator" />
      <meta itemProp="description" content={metaDescription} />
      <meta itemProp="url" content="" />
      <meta itemProp="image" content={metaImage} />
      <meta property="og:title" content="Options profit calculator" />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content="" />
      <meta property="og:image" content={metaImage} />
      <meta content={metaKeywords} property="og:keywords"></meta>
      <script
        async
        src="https://cdn.fuseplatform.net/publift/tags/2/2202/fuse.js"
      />
      {ANALYTICS.HOTJAR_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function (h, o, t, j, a, r) {
  h.hj =
    h.hj ||
    function () {
      (h.hj.q = h.hj.q || []).push(arguments);
    };
  h._hjSettings = { hjid: ${ANALYTICS.HOTJAR_ID}, hjsv: 6 };
  a = o.getElementsByTagName('head')[0];
  r = o.createElement('script');
  r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
`,
          }}
        />
      )}
      {ANALYTICS.ENABLE_TRACKING && ANALYTICS.GA_TRACKING_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.GA_TRACKING_ID}`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag() {
  // @ts-ignore
  window.dataLayer.push(arguments);
}
gtag('set',
  {
    'custom_map': {
      '${EXP_DIMENSIONS[EXPERIMENTS.HOME_HEADER]}': '${
                EXPERIMENTS.HOME_HEADER
              }',
      '${EXP_DIMENSIONS[EXPERIMENTS.POPULAR_STRAT_BUTTONS]}': '${
                EXPERIMENTS.POPULAR_STRAT_BUTTONS
              }',
      '${EXP_DIMENSIONS[EXPERIMENTS.LAYOUT]}': '${EXPERIMENTS.LAYOUT}',
      '${EXP_DIMENSIONS[EXPERIMENTS.PREVIOUS_USER_LAYOUT]}': '${
                EXPERIMENTS.PREVIOUS_USER_LAYOUT
              }',
    }
  }
);
gtag('js', new Date());
gtag('config', '${ANALYTICS.GA_TRACKING_ID}');
`,
            }}
          />
        </>
      )}
      {/* <script src="https://www.google-analytics.com/analytics.js" /> */}
    </Head>
  );
};

export default HtmlHeadView;
