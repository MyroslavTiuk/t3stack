import { rand } from "../../../utils/Data/Rand/Rand";

const proxyEndPoints = [
  "https://geq2nqx4dmg5ouy6mgpj7fm4rq0klrqk.lambda-url.us-east-1.on.aws/",
  "https://o6du4nwncf64p4wfu4tt6o64j40vyikk.lambda-url.us-east-1.on.aws/",
  "https://g63xouxansq44r2th7y475ijru0pfuzl.lambda-url.us-east-1.on.aws/",
  "https://cwqdfa2qyhyuubqxytit7ytm4m0hqywo.lambda-url.us-east-1.on.aws/",
  "https://ba4jbkusixsnfjyktfw3khu5qa0fygtw.lambda-url.us-east-1.on.aws/",
  "https://mtji4aiki2dctqzx3lspz7aob40mezbn.lambda-url.us-east-1.on.aws/",
  "https://nk73ztnuknypv6anmg5yk6a63y0xiqoh.lambda-url.us-east-1.on.aws/",
  "https://tshsroplh7iriyeyvqi4rr67v40aguin.lambda-url.us-east-1.on.aws/",
  "https://g65sr7r5orlov6u7eglwpn3ari0qqchp.lambda-url.us-east-1.on.aws/",
  "https://qmgnt5ppsvrtznuyz7cutglmry0cbzaf.lambda-url.us-east-1.on.aws/",
];

const determineFetchUrl = (
  url: string,
  referer: string,
  randomizeProxy = false
): [string, string] => {
  if (!randomizeProxy) return [url, referer];

  const baseProxyEndpoint = proxyEndPoints[rand(0, 10)];

  return [
    `${baseProxyEndpoint}?url=${encodeURIComponent(
      url
    )}&referer=${encodeURIComponent(referer)}`,
    referer,
  ];
};

export default determineFetchUrl;
