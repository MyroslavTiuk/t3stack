import React from "react";
import Box from "../Box";
import T from "./index";

import css from "./Typo-stories.module.scss";
import GridCols from "../GridCols";
import Story from "../Story/Story.view";

const TypographyStory = () => {
  return (
    <div>
      <GridCols>
        <Story title="With specific tag">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <T tagName="span">I'm a span</T>
        </Story>
        <Story title='"anemic" prop'>
          <Box className={["theme--dark flex-1", css["dark-card"]]}>
            <T content>content</T>
            <T content anemic>
              content anemic
            </T>
          </Box>
        </Story>
        <Story title='"no-weight" prop'>
          <T content-tag tagName="p">
            Content-tag
          </T>
          <T content-tag tagName="p" no-weight>
            Content-tag no-weight
          </T>
        </Story>
        <Story
          title='"clickable" prop'
          desc="Applies a consistent style for clickable text"
        >
          <Box className={"theme--light"}>
            <T content>Content</T>
            <T content clickable>
              Content clickable
            </T>
            <T content clickable subtle>
              Content clickable subtle
            </T>
          </Box>
        </Story>
      </GridCols>
      <T h3>Content styles</T>
      <p className={["h4", css.set].join(" ")}>.h1 (with default colors)</p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T h1>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T h1>Hello and welcome</T>
        </Box>
      </Box>
      <p className={["h4", css.set].join(" ")}>.h2 (with default colors)</p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T h2>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T h2>Hello and welcome</T>
        </Box>
      </Box>
      <p className={["h4", css.set].join(" ")}>.h3 (with default colors)</p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T h3>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T h3>Hello and welcome</T>
        </Box>
      </Box>
      <p className={["h4", css.set].join(" ")}>.h4 (with default colors)</p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T h4>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T h4>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>.h5 (with default colors)</p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T h5>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T h5>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-feature (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-feature>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-feature>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-detail (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-detail>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-detail>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-pragmatic (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-pragmatic>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-pragmatic>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-caption (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-caption>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-caption>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-tag (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-tag>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-tag>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-tag-clickable (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-tag-clickable>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-tag-clickable>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .text-error (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T text-error>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T text-error>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-field-label-inline (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-field-label-inline>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-field-label-inline>Hello and welcome</T>
        </Box>
      </Box>

      <p className={["h4", css.set].join(" ")}>
        .content-fields-set-label (with default colors)
      </p>
      <Box className="--space-around flex">
        <Box className={["theme--dark flex-1", css["dark-card"]]}>
          <T content-fields-set-label>Hello and welcome</T>
        </Box>
        <Box className="theme--light flex-1 ">
          <T content-fields-set-label>Hello and welcome</T>
        </Box>
      </Box>
    </div>
  );
};

export default TypographyStory;
