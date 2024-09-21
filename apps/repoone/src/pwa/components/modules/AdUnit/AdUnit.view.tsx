import React, { type FC, memo, type ReactElement, useEffect } from "react";

import { type Nullable } from "opc-types/lib/util/Nullable";
import useBreakpoint from "../../../../utils/Hooks/useBreakpoint";
import T from "../../primitives/Typo";
import Box from "../../primitives/Box";

import { type AdUnitProps } from "./AdUnit.props";
import css from "./AdUnit.module.scss";

const AdUnitView: FC<AdUnitProps> = ({
  fuseId,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  showMockAd,
  bottomCaption,
  refreshTime,
  fuseName,
}: AdUnitProps): ReactElement<"div"> => {
  const [servedMinHeight, setServedMinHeight] = React.useState(minHeight);
  const adWrapperRef = React.useRef(null as Nullable<HTMLDivElement>);

  const bkpt = useBreakpoint();
  useEffect(() => {
    if (refreshTime > 0) {
      // console.log('reloading ad-id', fuseId);
      // @ts-ignore
      window?.fusetag?.loadSlotById(fuseId);
    }
  }, [refreshTime]);

  React.useEffect(
    function resetMinHeightOnLayoutResize() {
      return setServedMinHeight(minHeight);
    },
    [bkpt, minHeight]
  );

  const checkHeight = React.useCallback(() => {
    if (adWrapperRef.current) {
      const { current: adEle } = adWrapperRef;
      const newHeight = adEle.getBoundingClientRect()?.height || 0;
      if (newHeight > servedMinHeight) {
        setServedMinHeight(newHeight);
      }
    }
  }, [adWrapperRef, servedMinHeight, setServedMinHeight]);
  React.useEffect(
    function observeAdElement() {
      if (adWrapperRef.current) {
        const obs = new MutationObserver(checkHeight);
        obs.observe(adWrapperRef.current, { subtree: true, childList: true });
      }
    },
    [checkHeight, !!adWrapperRef.current]
  );

  // note: the map is to force adding a key to the element to force re-rendering that dom element
  return (
    <>
      {[refreshTime].map((rft) => (
        <Box className={css.container} key={rft}>
          {!bottomCaption && (
            <T
              tagName="p"
              no-weight
              anemic
              className={[css.adBlurb, "align-right"]}
            >
              Advertisement
            </T>
          )}
          {showMockAd ? (
            <div
              style={{
                backgroundColor: "#ffeeee",
                minWidth,
                minHeight,
                maxWidth: maxWidth || "100%",
                maxHeight: maxHeight || "100%",
              }}
            >
              {fuseName || "Ad Here"}
            </div>
          ) : (
            <div
              className={css.adUnit}
              style={{
                minWidth,
                minHeight: Math.max(minHeight, servedMinHeight),
                maxWidth,
                maxHeight,
              }}
              ref={adWrapperRef}
            >
              <div data-fuse={fuseId} />
            </div>
          )}
          {bottomCaption && (
            <T
              tagName="p"
              content-tag
              no-weight
              anemic
              className={[css.adBlurb, "align-right", css["--bottom"]]}
            >
              Advertisement
            </T>
          )}
        </Box>
      ))}
    </>
  );
};

export default memo(AdUnitView);
