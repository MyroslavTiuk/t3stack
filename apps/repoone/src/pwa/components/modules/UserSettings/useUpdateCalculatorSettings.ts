import { type Tuple } from "opc-types/lib/Tuple";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  displayValueTypePairs,
  type DVPair,
} from "../../../../consts/displayValueTypePairs";
import {
  closePriceMethodOptions,
  coveredStrategiesOptions,
  legIVMethodOptions,
  timeDecayBasisOptions,
} from "../../../../consts/USER_SETTINGS_OPTIONS";
import { UsersCollection } from "../../../../services/Firebase/firestoreCollections";
import { COVERED_STRATEGIES } from "../../../../types/enums/COVERED_STRATEGIES";
import {
  checkPairItemMatch,
  getPairItemValue,
} from "../../../../utils/Data/tupleFns/tupleFns";

import { useToastNotification } from "../../primitives/ToastNotification/ToastNotificationProvider";
import { useSession } from "../Session/SessionProvider";
import { PREFERENCES } from "../../../../config/Preferences";
import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";

export default function useUpdateCalculatorSettings() {
  const isMobile = useMediaQuery("mobile-only");
  const { userData } = useSession();
  const [successMessage, setSuccessMessage] = useState("");
  const { addSuccessNotification } = useToastNotification();

  const getValueForAField = useCallback((field: string, options: any[]) => {
    return options.find((pair) => pair[0] === field)?.[1] || "";
  }, []);

  const onSelectItemByKeySetter = useCallback(
    (keySetter: Dispatch<SetStateAction<string>>, item?: Tuple<string>) => {
      if (item?.[0]) {
        keySetter(item?.[0]);
      }
    },
    []
  );

  // estimated value properties
  const [estimatedValueTypeKey, setEstimatedValueTypeKey] = useState<string>(
    userData?.userSettings?.defaultDisplayValueType
  );
  const estimatedValueType = useMemo(
    () => getValueForAField(estimatedValueTypeKey, displayValueTypePairs),
    [estimatedValueTypeKey, getValueForAField]
  );
  const onSelectEstimatedValueType = useCallback(
    (_val: string, item?: Tuple<string>) => {
      onSelectItemByKeySetter(setEstimatedValueTypeKey, item);
    },
    [setEstimatedValueTypeKey, onSelectItemByKeySetter]
  );

  // close price method properties
  const [closePriceMethodKey, setClosePriceMethodKey] = useState<string>(
    userData?.userSettings?.closePriceMethod ||
      PREFERENCES.DEFAULT_CLOSE_PRICE_METHOD
  );
  const closePriceMethodValue = useMemo(
    () => getValueForAField(closePriceMethodKey, closePriceMethodOptions),
    [closePriceMethodKey, getValueForAField]
  );
  const onSelectClosePriceMethod = useCallback(
    (_val: string, item?: Tuple<string>) => {
      onSelectItemByKeySetter(setClosePriceMethodKey, item);
    },
    [setClosePriceMethodKey, onSelectItemByKeySetter]
  );

  // leg IV estimation properties
  const [legIVMethodKey, setlegIVMethodKey] = useState<string>(
    userData?.userSettings?.legIVMethod || PREFERENCES.DEFAULT_LEG_IV_METHOD
  );
  const legIVMethodValue = useMemo(
    () => getValueForAField(legIVMethodKey, legIVMethodOptions),
    [legIVMethodKey, getValueForAField]
  );
  const onSelectLegIVMethod = useCallback(
    (_val: string, item?: Tuple<string>) => {
      onSelectItemByKeySetter(setlegIVMethodKey, item);
    },
    [setlegIVMethodKey, onSelectItemByKeySetter]
  );

  // time decay basis properties
  const [timeDecayBasisKey, setTimeDecayBasisKey] = useState<string>(
    userData?.userSettings?.timeDecayBasis ||
      PREFERENCES.DEFAULT_TIME_DECAY_BASIS
  );
  const timeDecayBasisValue = useMemo(
    () => getValueForAField(timeDecayBasisKey, timeDecayBasisOptions),
    [timeDecayBasisKey, getValueForAField]
  );
  const onSelectTimeDecayBasis = useCallback(
    (_val: string, item?: Tuple<string>) => {
      onSelectItemByKeySetter(setTimeDecayBasisKey, item);
    },
    [setTimeDecayBasisKey, onSelectItemByKeySetter]
  );

  // covered strategies properties
  const coveredStrategyInitialValue = useMemo(() => {
    return userData?.userSettings?.stockChangeInValue
      ? COVERED_STRATEGIES.SHOW_CHANGE_IN_STOCK_VALUE
      : COVERED_STRATEGIES.WITH_PURCHASE_OR_SALES_STOCK;
  }, [userData]);

  const [coveredStrategiesKey, setCoveredStrategiesKey] = useState<string>(
    coveredStrategyInitialValue
  );

  const coveredStrategiesValue = useMemo(
    () => getValueForAField(coveredStrategiesKey, coveredStrategiesOptions),
    [coveredStrategiesKey, getValueForAField]
  );
  const onSelectCoveredStrategies = useCallback(
    (_val: string, item?: Tuple<string>) => {
      onSelectItemByKeySetter(setCoveredStrategiesKey, item);
    },
    [setCoveredStrategiesKey, onSelectItemByKeySetter]
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onSaveCalculatorSettings = useCallback(async () => {
    try {
      setLoading(true);
      // todo: use SessionProvider's method for doing this
      await UsersCollection.doc(userData.id).set(
        {
          userSettings: {
            defaultDisplayValueType: estimatedValueTypeKey,
            closePriceMethod: closePriceMethodKey,
            legIVMethod: legIVMethodKey,
            timeDecayBasis: timeDecayBasisKey,
            stockChangeInValue: Boolean(
              coveredStrategiesKey ===
                COVERED_STRATEGIES.SHOW_CHANGE_IN_STOCK_VALUE
            ),
          },
        },
        { merge: true }
      );
      setLoading(false);
      addSuccessNotification("Successfully updated Calculator Settings");
      setSuccessMessage("Successfully updated Calculator Settings");
    } catch (e) {
      setLoading(false);
      setErrorMessage("Something went wrong while saving, please try again");
    }
  }, [
    userData,
    estimatedValueTypeKey,
    setSuccessMessage,
    addSuccessNotification,
    closePriceMethodKey,
    legIVMethodKey,
    timeDecayBasisKey,
    coveredStrategiesKey,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (field: string, options: any[]) => {
      return options.find((pair) => pair[0] === field)?.[1] || "";
    },
  ]);

  useEffect(() => {
    setSuccessMessage("");
    setErrorMessage("");
  }, [estimatedValueType]);

  const formValid = useMemo(() => {
    const displayValueChanged =
      userData?.userSettings?.defaultDisplayValueType !== estimatedValueTypeKey;
    const closingTradeOrderChanged =
      userData?.userSettings?.closePriceMethod !== closePriceMethodKey;
    const legIVMethodValid =
      userData?.userSettings?.legIVMethod !== legIVMethodKey;
    const timeDecayBasisValid =
      userData?.userSettings?.timeDecayBasis !== timeDecayBasisKey;
    const coveredStrategiesValid =
      coveredStrategyInitialValue !== coveredStrategiesKey;

    return (
      displayValueChanged ||
      closingTradeOrderChanged ||
      legIVMethodValid ||
      timeDecayBasisValid ||
      coveredStrategiesValid
    );
  }, [
    userData,
    estimatedValueTypeKey,
    closePriceMethodKey,
    legIVMethodKey,
    timeDecayBasisKey,
    coveredStrategiesKey,
    coveredStrategyInitialValue,
  ]);

  const displayValueTypesOption = useMemo(
    () =>
      displayValueTypePairs.map(
        (disPair) =>
          [disPair[0], disPair[1].replace("{trade}", "Option/spread")] as DVPair
      ),
    [displayValueTypePairs]
  );

  return {
    displayValueTypesOption,
    estimatedValueType,
    onSelectEstimatedValueType,
    closePriceMethodOptions,
    closePriceMethodValue,
    onSelectClosePriceMethod,
    legIVMethodOptions,
    legIVMethodValue,
    onSelectLegIVMethod,
    timeDecayBasisValue,
    timeDecayBasisOptions,
    onSelectTimeDecayBasis,
    coveredStrategiesValue,
    coveredStrategiesOptions,
    onSelectCoveredStrategies,
    onSaveCalculatorSettings,
    loading,
    errorMessage,
    successMessage,
    formValid,
    getPairItemValue,
    checkPairItemMatch,
    onSelectItemByKeySetter,
    isMobile,
  };
}
