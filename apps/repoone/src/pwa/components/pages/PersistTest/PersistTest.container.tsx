import { type FC } from "react";
import React from "react";
import { useDispatch } from "react-redux";

import {
  type PersistTestPublicProps,
  type PersistTestProps,
} from "./PersistTest.props";

import PersistTestView from "./PersistTest.view";
import testActions from "../../../store/actions/test";

const PersistTestContainer: FC<PersistTestPublicProps> = (
  _ownProps: PersistTestPublicProps
) => {
  const d = useDispatch();

  const add = React.useCallback(
    () => d(testActions.txfn((s) => ({ a: (s || {}).a + 1 }))),
    [d]
  );

  const combinedProps: PersistTestProps = {
    add,
  };

  return <PersistTestView {...combinedProps} />;
};

export default PersistTestContainer;
