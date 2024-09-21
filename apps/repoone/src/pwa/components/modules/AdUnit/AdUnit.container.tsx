import React, { type FC } from "react";

import { ADS } from "../../../../config/Ads";

import { type AdUnitProps, type AdUnitPublicProps } from "./AdUnit.props";

import AdUnitView from "./AdUnit.view";
import getAdPlacementAttributes from "./getAdPlacementAttributes";
import { AdRefreshContext } from "../../../../pages/_app";

const AdUnitContainer: FC<AdUnitPublicProps> = ({
  adPlacement,
  showAdvertisementBlurb,
  bottomCaption,
}) => {
  const { refreshTime } = React.useContext(AdRefreshContext);
  const showMockAd = ADS.USE_PLACEHOLDER_ADS;

  const adPlacementAttributes = getAdPlacementAttributes(adPlacement);

  if (!adPlacementAttributes) {
    return null;
  }

  const viewProps: AdUnitProps = {
    showMockAd,
    showAdvertisementBlurb,
    bottomCaption,
    refreshTime,
    ...adPlacementAttributes,
  };

  return <AdUnitView {...viewProps} />;
};

export default AdUnitContainer;
