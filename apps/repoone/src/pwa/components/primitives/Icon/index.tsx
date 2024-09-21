import React, { type FC } from "react";

import clx from "../../../../utils/Html/clx";

import AppleIcon from "../../../../../public/images/icons/apple.svg";
import LinkIcon from "../../../../../public/images/icons/link.svg";
import UnlinkIcon from "../../../../../public/images/icons/unlink.svg";
import LoadingIcon from "../../../../../public/images/icons/loading.svg";
import SearchIcon from "../../../../../public/images/icons/search.svg";
import UserIcon from "../../../../../public/images/icons/user.svg";
import CloseIcon from "../../../../../public/images/icons/close.svg";
import CopyIcon from "../../../../../public/images/icons/copy.svg";
import CheckIcon from "../../../../../public/images/icons/check.svg";
import ShareIcon from "../../../../../public/images/icons/share.svg";
import NewDocIcon from "../../../../../public/images/icons/new-doc.svg";
import OpenIcon from "../../../../../public/images/icons/open-1.svg";
import DoubleHCaretIcon from "../../../../../public/images/icons/double-h-caret-1.svg";
import NewIcon from "../../../../../public/images/icons/new.svg";
import MultiSelectorIcon from "../../../../../public/images/icons/multi-selector.svg";
import ArrowLineRightIcon from "../../../../../public/images/icons/arrow-line-right.svg";
import DoubleArrowLineRightIcon from "../../../../../public/images/icons/double-arrow-line-right.svg";
import ThreeDotMenuIcon from "../../../../../public/images/icons/three-dot-menu.svg";
import StrategyPurchase from "../../../../../public/images/icons/strategy-purchase.svg";
import StrategyButterfly from "../../../../../public/images/icons/strategy-butterfly.svg";
import StrategyCalendarSpread from "../../../../../public/images/icons/strategy-calendar-spread.svg";
import StrategyLongCall from "../../../../../public/images/icons/strategy-long-call.svg";
import StrategyLongPut from "../../../../../public/images/icons/strategy-long-put.svg";
import StrategyCoveredCall from "../../../../../public/images/icons/strategy-covered-call.svg";
import StrategyShortCall from "../../../../../public/images/icons/strategy-short-call.svg";
import StrategyShortPut from "../../../../../public/images/icons/strategy-short-put.svg";
import StrategyVerticalSpread from "../../../../../public/images/icons/strategy-vertical-spread.svg";
import StrategyCallDebitPutCreditSpreadBullishCollar from "../../../../../public/images/icons/strategy-call-debit-put-credit-spread-bullish-collar.svg";
import StrategyCallCreditPutDebitSpreadBearish from "../../../../../public/images/icons/strategy-call-credit-put-debit-spread-bearish.svg";
import StrategyDiagonalSpread from "../../../../../public/images/icons/strategy-diagonal-spread.svg";
import StrategyIronCondor from "../../../../../public/images/icons/strategy-iron-condor.svg";
import StrategyStraddle from "../../../../../public/images/icons/strategy-straddle.svg";
import StrategyStrangle from "../../../../../public/images/icons/strategy-strangle.svg";
import StrategyCoveredStrangle from "../../../../../public/images/icons/strategy-covered-strangle.svg";
import VisutalizationMatrix from "../../../../../public/images/icons/visualization-matrix.svg";
import StrategyDoubleDiagonalSpread from "../../../../../public/images/icons/strategy-double-diagonal-spread.svg";
import StrategyMisc from "../../../../../public/images/icons/strategy-misc.svg";
import Feedback from "../../../../../public/images/icons/feedback-1.svg";
import Flip from "../../../../../public/images/icons/flip.svg";
import Trash from "../../../../../public/images/icons/trash.svg";
import CogIcon from "../../../../../public/images/icons/cog1.svg";

import { type IconProps } from "./Icon.props";

import css from "./Icon.module.scss";

export const validIconMap = {
  apple: AppleIcon,
  link: LinkIcon,
  unlink: UnlinkIcon,
  loading: LoadingIcon,
  search: SearchIcon,
  close: CloseIcon,
  copy: CopyIcon,
  check: CheckIcon,
  user: UserIcon,
  share: ShareIcon,
  cog: CogIcon,
  "arrow-line-right": ArrowLineRightIcon,
  "double-arrow-line-right": DoubleArrowLineRightIcon,
  "double-h-caret": DoubleHCaretIcon,
  "new-doc": NewDocIcon,
  open: OpenIcon,
  new: NewIcon,
  "multi-select": MultiSelectorIcon,
  "three-dot-menu": ThreeDotMenuIcon,
  "strategy-purchase": StrategyPurchase,
  "strategy-butterfly": StrategyButterfly,
  "strategy-calendar-spread": StrategyCalendarSpread,
  "strategy-long-call": StrategyLongCall,
  "strategy-long-put": StrategyLongPut,
  "strategy-covered-call": StrategyCoveredCall,
  "strategy-short-call": StrategyShortCall,
  "strategy-short-put": StrategyShortPut,
  "strategy-vertical-spread": StrategyVerticalSpread,
  "strategy-call-debit-put-credit-spread-bullish-collar":
    StrategyCallDebitPutCreditSpreadBullishCollar,
  "strategy-call-credit-put-debit-spread-bearish":
    StrategyCallCreditPutDebitSpreadBearish,
  "strategy-diagonal-spread": StrategyDiagonalSpread,
  "strategy-iron-condor": StrategyIronCondor,
  "strategy-straddle": StrategyStraddle,
  "strategy-strangle": StrategyStrangle,
  "strategy-covered-strangle": StrategyCoveredStrangle,
  "visualization-matrix": VisutalizationMatrix,
  "strategy-double-diagonal-spread": StrategyDoubleDiagonalSpread,
  "strategy-misc": StrategyMisc,
  feedback: Feedback,
  flip: Flip,
  trash: Trash,
};

const ImageElement: React.FC<{
  h: string;
  src: string;
  w: string;
  alt: string;
  cls: string;
}> = ({ h, src, w, alt, cls }) => {
  return (
    <>
      <img src={src} alt={alt} width={w} height={h} className={cls} />
    </>
  );
};

const Icon: FC<IconProps> = (props: IconProps) => {
  const iconData = validIconMap[props.icon];

  const iconSvgProps = {
    className: clx([props.className, css.img]),
    ...(props.alt ? { alt: props.alt } : {}),
  };

  return !ImageElement ? (
    <span></span>
  ) : (
    <>
      <span
        className={clx([
          css.icon,
          props.ctnrClassName,
          props.inline && css["--inline"],
          props.xsmall && css["--size-xsmall"],
          props.small && css["--size-small"],
          props.smallMedium && css["--size-sm-med"],
          props.large && css["--size-large"],
          props.colorGuide && css["--color-guide"],
          props.colorHalfLink && css["--color-halfLink"],
          props.colorClickable && css["--color-clickable"],
          !props.xsmall &&
            !props.small &&
            !props.smallMedium &&
            !props.large &&
            !props.noSize &&
            css["--size-medium"],
        ])}
        {...(props.rotate
          ? { style: { transform: `rotate(${props.rotate}deg)` } }
          : {})}
        {...(props.onClick ? { onClick: props.onClick } : {})}
      >
        {/*@ts-ignore*/}
        <ImageElement {...iconData} {...iconSvgProps} />
      </span>
    </>
  );
};

export default React.memo(Icon);
