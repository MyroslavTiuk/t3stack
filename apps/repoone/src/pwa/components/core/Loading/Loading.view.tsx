import React, { type ReactElement, type FC } from "react";

// import clx from "../../../../utils/Html/clx";

import css from "./Loading.module.scss";
import Spinner from "../../primitives/Spinner";

type Props = {
  showOverlay: boolean;
  isLoading: boolean;
};

const Loading: FC<Props> = (props: Props): ReactElement<"div"> => {
  // const loadState = props.isLoading
  //   ? `--loading-${Math.floor(Math.random() * 2) + 1}`
  //   : `--loaded`;
  return (
    <>
      {/*<div className={clx([css.loadingBar, css[loadState]])} />*/}
      {props.showOverlay && (
        <div
          className={`${css.overlay} --center flex items-center justify-center`}
        >
          <Spinner />
        </div>
      )}
    </>
  );
};

export default Loading;
