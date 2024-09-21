import React from "react";
import Story from "../Story";
import GridCols from "../GridCols";
import TabGroup from "./TabGroup";
import Box from "../Box";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

const TabGroupStory = () => {
  return (
    <GridCols>
      <Story title="Basic" className="_cols-4">
        <TabGroup
          tabs={{
            one: "One",
            two: "Two",
          }}
        >
          {(curTab) =>
            ((
              {
                one: <Box>One here</Box>,
                two: <Box>Two heeeere</Box>,
              } as ObjRecord<React.ReactNode>
            )[curTab] || null)
          }
        </TabGroup>
      </Story>
    </GridCols>
  );
};

export default TabGroupStory;
