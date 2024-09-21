import { type AdPlacement } from "opc-types/lib/AdPlacement";
import { type AD_POSITIONS } from "../../../../types/enums/AD_POSITIONS";

interface AdUnitPassedProps {
  showAdvertisementBlurb?: boolean;
  bottomCaption?: boolean;
}

export interface AdUnitPublicProps extends AdUnitPassedProps {
  adPlacement: AD_POSITIONS;
}

interface AdUnitCalcedProps extends AdPlacement {
  showMockAd?: boolean;
  refreshTime: number;
}

export interface AdUnitProps extends AdUnitPassedProps, AdUnitCalcedProps {}
