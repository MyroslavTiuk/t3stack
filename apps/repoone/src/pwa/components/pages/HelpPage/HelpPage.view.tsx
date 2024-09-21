import { type FC, type ReactElement } from "react";
import React from "react";

// import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";
import MainLayout from "../../layouts/MainLayout";
import T from "../../primitives/Typo";
import Box from "../../primitives/Box";

import commonCss from "../common.module.scss";
import { type HelpPageProps } from "./HelpPage.props";
// import useLocationParams from "../../../../utils/Hooks/useLocationParams";

const HelpPageView: FC<HelpPageProps> = (_props): ReactElement<"div"> => {
  // const isMobile = useMediaQuery("tablet-down");
  // const path = useLocationParams();

  return (
    <MainLayout nestedCard>
      <Box className={[commonCss.textContent, "formatted-content"]}>
        <T h2>Heading</T>
      </Box>
    </MainLayout>
  );
};

export default HelpPageView;
