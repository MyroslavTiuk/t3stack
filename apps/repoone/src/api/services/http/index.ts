import qs from "qs";
import * as Mx from "errable";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { wrapper } from "axios-cookiejar-support";

import tough from "tough-cookie";

import { type t } from "opc-types/lib/";

import { errorFactory } from "../../infrastructure/errorHanding";

import { fill } from "~/utils/Data/dataTransform/dataTransform";
import l from "../../../services/logger";

import determineFetchUrl from "./determineFetchUrl";

wrapper(axios);

const defaultHeaders = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Cache-Control": "max-age=0",
  Connection: "keep-alive",
  "Keep-Alive": "300",
  "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
  "Accept-Language": "en-us,en;q=0.5",
  Pragma: "", // browsers keep this blank.
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
  "Content-Type": "application/x-www-form-urlencoded",
};

const defaultCfg = {
  timeout: 30000,
};

type CustomConfig = {
  acceptNon200?: boolean;

  jar?: NonNullable<unknown>;
  randomizeProxy?: boolean;
};

// todo: abstract get and post to one request function
// todo: catch failures and ensure they are ErrorDatas
export const get = <T>(
  url: string,
  config: AxiosRequestConfig & CustomConfig = {}
): Promise<t.Outcome<T>> => {
  const cookieJar = new tough.CookieJar();

  const [fetchUrl, fetchReferer] = determineFetchUrl(
    url,
    config.headers?.referer || url,
    config.randomizeProxy
  );
  l.debug("get request to ", fetchUrl);

  const headersFilled = Object.assign(
    { Referer: fetchReferer },
    defaultHeaders,
    config.headers
  );

  const configFilled = fill(
    {
      headers: headersFilled,
      jar: cookieJar,
      withCredentials: true,
      validateStatus: config.acceptNon200 ? () => true : config.validateStatus,
      ...config,
    },
    defaultCfg
  );

  return Mx.fromPromise(axios.get(fetchUrl, configFilled)).then(
    Mx.ifNotErr(
      (axResp: AxiosResponse): t.Outcome<any> =>
        config.acceptNon200 || axResp.status === 200
          ? Mx.val(axResp.data)
          : errorFactory(axResp.statusText, axResp)
    )
  );
};

export const post = <T>(
  url: string,
  postData: Record<string, string>,
  config: AxiosRequestConfig = {},
  returnType: "data" | "raw" = "data"
): Promise<t.Outcome<T>> => {
  l.debug("post request to ", url);
  const cookieJar = new tough.CookieJar();

  const headersFilled = Object.assign(
    { Referer: url },
    defaultHeaders,
    config.headers
  );

  const configFilled = fill(
    {
      headers: headersFilled,
      jar: cookieJar,
      withCredentials: true,
      ...config,
    },
    defaultCfg
  );

  return Mx.fromPromise(axios.post(url, qs.stringify(postData), configFilled))
    .then(
      Mx.withErr((e: AxiosResponse) => {
        return returnType === "raw" ? e.data : e;
      })
    )
    .then(
      Mx.ifNotErr((axResp: AxiosResponse): t.Outcome<T> => {
        return returnType === "raw"
          ? Mx.val(axResp)
          : axResp.status === 200
          ? Mx.val(axResp.data)
          : errorFactory(`Could not make request to ${url}`, axResp);
      })
    );
};

export const postRaw: typeof post = (a, b, c) => post(a, b, c, "raw");
