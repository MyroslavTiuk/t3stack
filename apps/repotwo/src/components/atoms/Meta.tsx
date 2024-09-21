import Head from "next/head";

type Props = {
  title: string;
  keywords: string;
  description: string;
  url: string;
  type: string;
  imge: string;
} & typeof defaultProps;

const defaultProps = {
  title: "Option Trading Software",
  keywords: "Option Trading, Calculate Options Profit",
  description: "Get access to option trading tools",
  type: "Website",
  imge: "https://optionscout.com/option_scout_logo.png",
  url: "",
};

export const Meta = ({
  title,
  keywords,
  description,
  url,
  type,
  imge,
}: Props) => (
  <Head>
    <title>{title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content={keywords} />
    <meta name="description" content={description} />
    <meta name="title" content={title} key="title" />
    <meta property="og:description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={imge} />
    <meta property="og:site_name" content="option scout" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content={type} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:url" content={url} />
    <meta name="twitter:image" content={imge} />
    <meta charSet="utf-8" />
    <meta
      name="robots"
      content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"
    />
    <link rel="canonical" href={url} />
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1222118220508276"
      crossOrigin="anonymous"
    ></script>
  </Head>
);

Meta.defaultProps = defaultProps;
