import React, { createContext, useContext, useMemo } from "react";

// import firebase from 'firebase/app';
// import 'firebase/auth';

import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type StrategyOverviewWithCalculation } from "opc-types/lib/StrategyOverview";
import { type Nullable } from "opc-types/lib/util/Nullable";

import { useSession } from "../../pwa/components/modules/Session/SessionProvider";
import selectUnderlyingLeg from "../../pwa/store/selectors/currentCalculation/selectUnderlyingLeg";
import getStrategyTitle from "../../utils/Finance/getStrategyTitle";
import groupCalcs, {
  type GroupedStrategiesWithCalculation,
} from "../../utils/Finance/groupCalcs";

//import { CalculationsCollection } from '../Firebase/firestoreCollections';
import {
  AUTH_STATUS,
  type UserData,
} from "../../pwa/components/modules/Session/Session.types";
import useDispaction from "../../utils/Redux/useDispaction";
import calculationsActions from "../../pwa/store/actions/calculations";
import Interface from "../../config/Interface";

export enum CalculationStatus {
  ACTIVE = "Active",
  DELETED = "Deleted",
}

interface CalculationProviderProps {
  children: JSX.Element;
}

interface CalculationFromFirebase {
  id: string;
  userId: string;
  dateCreated: "20-20-2029 11:10:11"; //firebase.firestore.Timestamp;
  dateUpdated?: "20-20-2029 11:10:11"; //firebase.firestore.Timestamp;
  calculation: StrategyComplete;
  strategyVersion: string;
}

export interface CalculationWithEstimates {
  calculation: StrategyComplete;
  estimates: Nullable<StrategyEstimate>;
}

export const CalculationsContext = createContext({
  calculations: [] as Strategy[],
  groupedCalculations: {} as GroupedStrategiesWithCalculation,
  calculationsFromFirebase: [] as CalculationFromFirebase[],
  loadingCalculations: false,
  resolvingPublicCalc: false,
  saveCalculation: () => Promise.resolve({} as string),
  deleteCalculation: (_: string) => Promise.resolve(false),
});

export async function saveCalculationToFirebase(
  _calculation: Strategy,
  _: UserData
) {
  //const { Timestamp } = firebase.firestore;

  // const firebaseCalculation = reduxCalcToFirebaseCalc(calculation);
  // const result = await (calculation.id
  //   ? CalculationsCollection.doc(calculation.id)
  //       .set(
  //         {
  //           dateUpdated: Timestamp.now(),
  //           calculation: firebaseCalculation,
  //           strategyVersion: StrategyDefault.version,
  //           userId: userData.id,
  //           status: CalculationStatus.ACTIVE,
  //         },
  //         { merge: true },
  //       )
  //       .then(() => ({ id: calculation.id as string }))
  //   : CalculationsCollection.add({
  //       userId: userData.id,
  //       dateCreated: Timestamp.now(),
  //       calculation: firebaseCalculation,
  //       strategyVersion: StrategyDefault.version,
  //       status: CalculationStatus.ACTIVE,
  //     }));

  const result = false;

  return result;
}

export default function CalculationsProvider({
  children,
}: CalculationProviderProps) {
  const { authStatus } = useSession();

  const shouldUseFirebaseCalcs =
    !Interface.ENABLE_LOCAL_SAVED_CALCS ||
    authStatus === AUTH_STATUS.STATE_AUTHED;
  // const timeNow = Date.now();
  // const [calculationsSnapshot, loadingFBCalculations] = useCollection(
  //   // @ts-ignore
  //   userData?.id &&
  //     CalculationsCollection.where('userId', '==', userData.id)
  //       .where('status', '==', CalculationStatus.ACTIVE)
  //       .where('calculation.expiryDate', '>=', nowUnix - EXPIRED_CALC_LEEWAY),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   },
  // );

  const loadingFBCalculations = false;

  // const [
  //   publicCalculationSnapshot,
  //   loadPublicCalculationSnapshot,
  // ] = useCollection(
  //   // @ts-ignore
  //   router.query.id &&
  //     CalculationsCollection.where(
  //       'calculation.id',
  //       '==',
  //       router.query.id || '',
  //     ).where('calculation.permission', '==', CALCULATION_PERMISSION.PUBLIC),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   },
  // );

  const loadingCalculations = loadingFBCalculations;
  const resolvingPublicCalc = false; //loadPublicCalculationSnapshot ;

  // const saveCalcToRedux = useDispaction(calculationsActions.upsert);

  // const saveCalculation = useCallback(
  //   async (calculation: StrategyComplete): Promise<{ id?: string }> => {
  //     let formattedCalculation = calculation;
  //
  //     if (calculation.readOnly) {
  //       formattedCalculation = {
  //         ...omit(['readOnly'], calculation),
  //         id: '',
  //         permission: CALCULATION_PERMISSION.PRIVATE,
  //       };
  //     }
  //
  //     const calcWithId = formattedCalculation.id
  //       ? formattedCalculation
  //       : set(lensProp('id'), short.generate(), formattedCalculation);
  //     const result = shouldUseFirebaseCalcs
  //       ? await saveCalculationToFirebase(calcWithId, userData)
  //       : (() => {
  //           saveCalcToRedux(calcWithId);
  //           // unsure
  //           return { id: calcWithId.id || undefined };
  //         })();
  //
  //     if (calculation.readOnly || (!calculation.id && result.id)) {
  //       const newLocStrat = calculation.metadata.stratKey;
  //       const query: ObjRecord<string> = { strat: newLocStrat, id: result?.id };
  //       if (Env.DEBUG_REDIRECTS) {
  //         l.debug(
  //           'Redirecting [saveCalculation result] to',
  //           ROUTE_PATHS.CALCULATOR,
  //           newLocStrat,
  //           result?.id,
  //         );
  //       }
  //       router.replace(
  //         { pathname: ROUTE_PATHS.CALCULATOR, query },
  //         addDotHtml(
  //           `${ROUTE_PATHS.CALCULATOR.replace('[strat]', newLocStrat)}?id=${
  //             result?.id
  //           }`,
  //         ),
  //         { shallow: true },
  //       );
  //     }
  //     return result;
  //   },
  //   [shouldUseFirebaseCalcs, userData],
  // );
  //
  const saveCalculation = () => {
    return new Promise<string>((resolve) => {
      resolve("");
    });
  };

  const dispatchDeleteCalc = useDispaction(calculationsActions.delete);
  const deleteCalculation = React.useCallback(
    async (calcId: string) => {
      if (shouldUseFirebaseCalcs) {
        try {
          // await CalculationsCollection.doc(calcId).set(
          //   {
          //     status: CalculationStatus.DELETED,
          //   },
          //   { merge: true },
          // );
          return true;
        } catch (e) {
          return false;
        }
      } else {
        dispatchDeleteCalc(calcId);
        return true;
      }
    },
    [shouldUseFirebaseCalcs]
  );

  // const calculationsFromFirebase = useMemo(() => {
  //   const filteredPublicCalc = publicCalculationSnapshot?.docs.filter((doc) => {
  //     const calcData = doc.data();
  //     return calcData.userId !== userData.id;
  //   });
  //   const publicCalc = ((filteredPublicCalc?.map((doc) => {
  //     const calcData = doc.data();
  //     return {
  //       ...calcData,
  //       id: doc.id,
  //       userId: userData.id,
  //       calculation: {
  //         ...calcData?.calculation,
  //         metadata: getMetadata(calcData?.calculation),
  //         readOnly: true,
  //       },
  //     };
  //   }) || []) as CalculationFromFirebase[]).sort(
  //     (a, b) => a?.dateCreated?.seconds - b?.dateCreated?.seconds,
  //   );
  //   if (!shouldUseFirebaseCalcs) return publicCalc;
  //
  //   const usersCalc = ((calculationsSnapshot?.docs?.map((doc) => {
  //     const calcData = doc.data();
  //     return {
  //       ...calcData,
  //       id: doc.id,
  //       calculation: {
  //         // fill defaults for older calculations
  //         permission: 'PRIVATE',
  //         // -- end defaults --
  //         ...calcData?.calculation,
  //         metadata: getMetadata(calcData?.calculation),
  //       },
  //     };
  //   }) || []) as CalculationFromFirebase[]).sort(
  //     (a, b) => a?.dateCreated?.seconds - b?.dateCreated?.seconds,
  //   );
  //
  //   return [...usersCalc, ...publicCalc];
  // }, [
  //   shouldUseFirebaseCalcs,
  //   calculationsSnapshot,
  //   publicCalculationSnapshot,
  //   userData.id,
  // ]) as CalculationFromFirebase[];

  const calculationsFromFirebase: any[] = [];

  const calculations = useMemo((): StrategyComplete[] => {
    return [];
  }, [shouldUseFirebaseCalcs, calculationsFromFirebase]);

  React.useEffect(() => {
    //setSessionCalculations(calculations);
  }, [calculations]);

  const groupedCalculations = React.useMemo(() => {
    const formattedCalculationsForGrouping = calculations
      .filter((calc) => !calc.readOnly)
      .map((item) => {
        const symbol = selectUnderlyingLeg(item)?.val;
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { stratKey } = item?.metadata;
        if (!symbol || !stratKey) return false;
        return {
          title: getStrategyTitle(item),
          id: item?.id,
          symbol,
          stratKey,
          calculation: item,
        };
      })
      .filter((c) => !!c) as StrategyOverviewWithCalculation[];
    const finalGroupedCalcs: GroupedStrategiesWithCalculation = groupCalcs(
      formattedCalculationsForGrouping
    );
    return finalGroupedCalcs;
  }, [calculations]);

  return (
    <CalculationsContext.Provider
      value={{
        calculations,
        groupedCalculations,
        calculationsFromFirebase,
        loadingCalculations,
        resolvingPublicCalc,
        saveCalculation,
        deleteCalculation,
      }}
    >
      {children}
    </CalculationsContext.Provider>
  );
}

export const useCalculations = () => useContext(CalculationsContext);
