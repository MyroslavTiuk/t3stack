import { type FC, type ReactElement } from "react";
import React from "react";
import { type PersistTestProps } from "./PersistTest.props";

const PersistTestView: FC<PersistTestProps> = (
  _props: PersistTestProps
): ReactElement<"div"> => {
  return <div onClick={_props.add}>Add</div>;
};

export default PersistTestView;
