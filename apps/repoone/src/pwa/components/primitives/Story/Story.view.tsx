import { type FC } from "react";
import React from "react";

import Box from "../Box";
import T from "../Typo";

import { type StoryProps } from "./Story.props";
import Card from "../Card";

// import css from './Story.scss';

const Story: FC<StoryProps> = (props: StoryProps): ReturnType<typeof Box> => {
  return (
    <Box ph={1 / 3} pv={1 / 3} className={props.className || ""}>
      <Card>
        <T h4>{props.title}</T>
        <div
          style={{
            outline: "3px solid rgba(255, 0, 255, 0.15)",
            margin: "3px",
          }}
        >
          {props.children}
        </div>
        {props.desc && (
          <div>
            <T content-detail>{props.desc}</T>
          </div>
        )}
      </Card>
    </Box>
  );
};

export default React.memo(Story);
