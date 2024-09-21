import React from "react";
import Box from "../Box";
import Story from "../Story";

import Card from "./index";
import css from "./Card-stories.module.scss";

const DemoCard = (p: any) => (
  <Card {...p}>
    <h3 className="h3">Hey everybody</h3>
    <p className="content">I'm a card</p>
  </Card>
);

const CardStory = () => {
  return (
    <div>
      <Story title="Default">
        <Box className="grid">
          <Box className={["_6 theme--dark", css["dark-bg"], css.ctnr]}>
            <DemoCard />
          </Box>
          <Box className={["_6 theme--light", css.ctnr]}>
            <DemoCard />
          </Box>
        </Box>
      </Story>
      <Story title="Inset">
        <Box className="grid">
          <Box className={["_6 theme--dark", css["dark-bg"], css.ctnr]}>
            <DemoCard inset />
          </Box>
          <Box className={["_6 theme--light", css.ctnr]}>
            <DemoCard inset />
          </Box>
        </Box>
      </Story>
      <Story title="Level 2">
        <Box className="grid">
          <Box className={["_6 theme--dark", css["dark-bg"], css.ctnr]}>
            <DemoCard level2 />
          </Box>
          <Box className={["_6 theme--light", css.ctnr]}>
            <DemoCard level2 />
          </Box>
        </Box>
      </Story>
    </div>
  );
};

export default CardStory;
