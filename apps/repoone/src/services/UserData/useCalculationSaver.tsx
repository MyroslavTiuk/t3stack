import * as R from "ramda";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isUndefined } from "errable";

import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

import { useSession } from "../../pwa/components/modules/Session/SessionProvider";

import css from "../../pwa/components/modules/StrategyCalculator/SaveCalculations/SaveCalculations.module.scss";
import useDispatchUpdateParam from "../../pwa/components/modules/StrategyCalculator/utils/useDispatchUpdateParam";
import Icon from "../../pwa/components/primitives/Icon";
import { useModalContext } from "../../pwa/components/primitives/Modal/ModalProvider";
import Spinner from "../../pwa/components/primitives/Spinner";
import { useToastNotification } from "../../pwa/components/primitives/ToastNotification/ToastNotificationProvider";
import usePreviousRef from "../../utils/Hooks/usePreviousRef";
import { useCalculations } from "./CalculationsProvider";

interface UseSaveCalculationsParams {
  currentCalc: Nullable<Strategy>;
  formCompleted: boolean;
}

export default function useCalculationSaver({
  currentCalc,
  formCompleted,
}: UseSaveCalculationsParams) {
  const [saving, setSaving] = useState(false);
  const updateCalculationId = useDispatchUpdateParam("id");
  const { authStatus } = useSession();

  const { showModal, hideModal } = useModalContext();
  const { addSuccessNotification, addErrorNotification } =
    useToastNotification();
  const { saveCalculation } = useCalculations();

  const saveCalculations = useCallback(
    async ({
      calculation,
    }: {
      calculation: Strategy;
    }): Promise<{ id?: string }> => {
      if (saving === true) {
        return {};
      }
      setSaving(true);
      try {
        // todo: This is a type-fudge
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = await saveCalculation(calculation as StrategyComplete);
        setSaving(false);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!currentCalc?.id && result?.id) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          updateCalculationId(result?.id);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return result;
      } catch (error) {
        addErrorNotification("Could not save calculation");
        setSaving(false);
        return {};
      }
    },
    [
      saveCalculation,
      currentCalc?.id,
      saving,
      updateCalculationId,
      addErrorNotification,
    ]
  );

  const onCloneCalculation = useCallback(() => {
    const currentCalcWithResetId = R.assoc(
      "id",
      null,
      currentCalc
    ) as unknown as typeof currentCalc;
    saveCalculations({ calculation: currentCalcWithResetId as Strategy }).then(
      ({ id }) => {
        if (!isUndefined(id)) {
          addSuccessNotification("New copy saved");
        } else {
          addErrorNotification("Could not save copy");
        }
      }
    );
  }, [
    saveCalculations,
    currentCalc,
    addErrorNotification,
    addSuccessNotification,
  ]);

  const onLogin = useCallback(() => {
    showModal({
      // eslint-disable-next-line react/display-name
      content: () => (
        // <LoginRegistrationContainer
        //   initialActiveTab={LoginRegistrationTabOptions.Register}
        //   onLoginSuccess={hideModal}
        //   headerText="To save your calculations, login or register for free"
        // />
        <div></div>
      ),
    });
  }, [showModal, hideModal]);

  const prevProps = usePreviousRef({ currentCalc });
  useEffect(
    function saveCalculationOnComplete() {
      if (currentCalc && formCompleted) {
        if (!prevProps?.currentCalc?.readOnly && currentCalc.readOnly) {
          return;
        }

        const prevCalcWithOutId = JSON.stringify(
          R.omit(["id"], prevProps?.currentCalc)
        );
        const currentCalcWithOutId = JSON.stringify(
          R.omit(["id"], currentCalc)
        );

        if (prevCalcWithOutId !== currentCalcWithOutId) {
          saveCalculations({ calculation: currentCalc });
        }
      }
    },
    [formCompleted, currentCalc]
  );

  const { statusString, statusIcon } = useMemo(
    () =>
      // eslint-disable-next-line no-nested-ternary
      saving
        ? {
            statusString: "Saving...",
            statusIcon: (
              <span className={css._iconContainer}>
                <Spinner className={css._icon} small />
              </span>
            ),
          }
        : formCompleted
        ? {
            statusIcon: (
              <Icon
                icon="check"
                small
                className={css._icon}
                ctnrClassName={css._iconContainer}
              />
            ),
            statusString: "Autosaved",
          }
        : { statusIcon: null, statusString: "Draft" },
    [saving, formCompleted]
  );

  return {
    onCloneCalculation,
    saveCalculations,
    loading: saving,
    statusString,
    statusIcon,
    onLogin,
    authStatus,
  };
}
