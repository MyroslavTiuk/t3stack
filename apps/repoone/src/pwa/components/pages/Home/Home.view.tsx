import React, { type FC } from "react";
import Experiment from "react-ab-test/lib/Experiment";
import Variant from "react-ab-test/lib/Variant";
import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import commonCss from "../common.module.scss";
import QuickStartPanel from "./QuickStartPanel";
import { type HomeProps } from "./Home.props";
import css from "./Home.module.scss";
import { EXPERIMENTS } from "../../../../services/Experiments/experiments";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type HomeViewProps = {
  header: "full" | "short" | "none";
  // showQuickButtons?: boolean;
};

const HomeView: FC<HomeViewProps> = (props: HomeViewProps) => {
  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <div className="flex h-full w-full flex-col justify-start md:flex-row ">
      <Box>
        <Box
          className={[
            commonCss.contentInner,
            commonCss["--no-pad"],
            css.quickStartRow,
            props.header !== "none" && css["--offset"],
            "!p-0",
          ]}
          flex-wrap
        >
          <Box className={css._quickStart} flex-1>
            <QuickStartPanel />
          </Box>
        </Box>
      </Box>
      <div className="hidden md:flex md:flex-col">
        <Box>
          <Box
            className={[
              commonCss.contentInner,
              commonCss["--no-pad"],
              css.quickStartRow,
              "!px-0",
            ]}
          >
            <Box
              className={[css._quickStart, "!mr-0"]}
              mt={2}
              mb={3}
              formatted-content
            >
              <T content>
                View estimated returns over time at any theoretical underlying
                price. View results in our original profit matrix, or by risk
                profile line-graph. See the effect of implied volatility using
                our new IV slider.
              </T>
              <T content>
                Our calculator prices the future value of options using the
                Black Scholes formula, giving you the best chance of knowing
                your anticipated outcome.
              </T>
              <T content>
                Use the calculator that has provided visibility to the options
                trading community since 2008.
              </T>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

const HomeExpView: FC<HomeProps> = (_props: HomeProps) => {
  return (
    <Experiment name={EXPERIMENTS.HOME_HEADER}>
      <Variant name={"full"}>
        <HomeView header={"full"} />
      </Variant>
      <Variant name={"short"}>
        <HomeView header={"short"} />
      </Variant>
      <Variant name={"none"}>
        <HomeView header={"none"} />
      </Variant>
    </Experiment>
  );
};

export default HomeExpView;
