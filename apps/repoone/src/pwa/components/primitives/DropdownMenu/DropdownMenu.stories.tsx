import React from "react";
import Story from "../Story";
import GridCols from "../GridCols";
import DropdownMenu from "./DropdownMenu";
import Box from "../Box";
import T from "../Typo";

const DropdownMenuStory = () => {
  return (
    <GridCols>
      <Story title="Basic" className="_cols-4">
        <DropdownMenu>
          {[
            // eslint-disable-next-line react/jsx-key
            <T>Drop it like it's hot</T>,
            // eslint-disable-next-line react/jsx-key
            <Box>
              <T>Contents</T>
            </Box>,
          ]}
        </DropdownMenu>
      </Story>
    </GridCols>
  );
};

export default DropdownMenuStory;
