import { type FC } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import Box from "../../primitives/Box";
import T from "../../primitives/Typo";
import Link from "../../primitives/Link";

import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import useSelectorSafe from "../../../store/selectors/useSelectorSafe";
import commonActions from "../../../store/actions/common";

type ResetProps = {};

const Reset: FC<ResetProps> = (_props: ResetProps): ReturnType<typeof Box> => {
  const dispatch = useDispatch();
  const state = useSelectorSafe((_) => _) || {};

  React.useEffect(() => {
    setTimeout(() => dispatch(commonActions.reset()), 2000);
  }, []);

  return (
    <Box>
      <T h2>Resetting state in 2 seconds</T>
      <Link to={ROUTE_PATHS.ROOT}>Go home</Link>
      <pre>{JSON.stringify(state, undefined, "  ")}</pre>
    </Box>
  );
};

export default Reset;
