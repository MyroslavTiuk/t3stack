import React, { type FC, type ReactElement } from "react";
import axios, { type AxiosResponse } from "axios";
import { pipe } from "ramda";
import {
  err,
  ifNotErr,
  ifNotErrAsync,
  ifNotUndefined,
  recover,
  recoverUndefined,
  withNotErr,
} from "errable";

import { type Optional } from "opc-types/lib/util/Optional";

import MainLayout from "../../layouts/MainLayout";
import Spinner from "../../primitives/Spinner";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";

import css from "./ContentPage.module.scss";
import { type ContentPageProps } from "./ContentPage.props";
import { type GetStaticPropsContext } from "next";
import CMS_CONTENT_MAP from "../../../../consts/CMS_CONTENT_MAP";

const ERROR_PENDING = "ERROR_PENDING";
const ERROR = "ERROR";
const ERROR_NOT_FOUND = "ERROR_NOT_FOUND";

const localiseBody = (cssPrefix: string, body: Optional<string>) => {
  const styleMatcher = /<style(.*?)>(.*?)<\/style>/;
  if (!body) return ERROR_PENDING;
  return pipe(
    () => body,
    ifNotUndefined((bodyStr) => bodyStr.match(styleMatcher)),
    ifNotUndefined((matches) => matches?.[2]),
    ifNotUndefined((styleBody) =>
      styleBody.replace(
        /(p|h1|h2|h3|h4|h5|h6|li|ol|table td,table th|\.subtitle|\.title)\{.*?\}/g,
        ""
      )
    ),
    ifNotUndefined((styleBody) =>
      styleBody.replace(/@import url\(.*?\);/g, "")
    ),
    ifNotUndefined((styleBody) => styleBody.replace(/\}/g, `}.${cssPrefix} `)),
    ifNotUndefined((localisedStyles) => {
      return body?.replace(styleMatcher, `<style$1>${localisedStyles}</style>`);
    }),
    ifNotUndefined((newBody) =>
      newBody.replace(
        /<p[^>]*?><span[^>]*?><img(.*?)style=".*?width:(.*?);.*?"(.*?)>/g,
        `<p class="_imgCtnr"><img$1style="width:$2"$3>`
      )
    ),
    recoverUndefined(() => ERROR)
  )();
};

const ContentPageView: FC<ContentPageProps> = (
  props: ContentPageProps
): ReactElement<"div"> => {
  const { body } = props;

  return (
    <MainLayout nestedCard>
      {body === ERROR_PENDING ? (
        <Box flex-center mv={4}>
          <Spinner />
        </Box>
      ) : body === ERROR ? (
        <>
          <T h2>Could not load this page</T>
          <T content>
            Unfortunately, this page could not be found or could not be loaded
            right now.
          </T>
        </>
      ) : (
        <Box className="formatted-content--all">
          <Box
            className={[css.contentBlock]}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Box>
      )}
    </MainLayout>
  );
};

export const createGetStaticProps =
  (basePath: string) =>
  async ({ params }: GetStaticPropsContext) => {
    return Promise.resolve(`${basePath ?? ""}${params?.slug ?? ""}`)
      .then((fullPath) => CMS_CONTENT_MAP[fullPath] || err(ERROR_NOT_FOUND))
      .then(
        ifNotErrAsync((gDocCode) => {
          return axios.get(
            `https://docs.google.com/document/${gDocCode}/pub?embedded=true`
          );
        })
      )
      .then(
        ifNotErr((resp: AxiosResponse<unknown>) => {
          if (resp.status === 200 && typeof resp.data === "string") {
            return resp.data;
          }
          return err(ERROR);
        })
      )
      .then(withNotErr((data) => localiseBody(css.content, data)))
      .catch((err: any) => err(ERROR))
      .then(recover(ERROR))
      .then((localisedBody) => ({
        props: {
          body: localisedBody,
        },
      }));
  };

export default ContentPageView;
