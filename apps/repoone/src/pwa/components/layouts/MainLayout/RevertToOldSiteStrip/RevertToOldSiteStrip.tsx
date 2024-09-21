import { type FC, type FormEvent } from "react";
import React from "react";
import { useRouter } from "next/router";

import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";
import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";

import css from "./RevertToOldSiteStrip.module.scss";
import { useModalContext } from "../../../primitives/Modal/ModalProvider";
import Button from "../../../primitives/Button";
import useToggleState from "../../../../../utils/Hooks/useToggleState";
import { SITE } from "../../../../../config/Site";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import analyticsActions from "../../../../store/actions/analytics";
import useBreakpoint from "../../../../../utils/Hooks/useBreakpoint";
import getHotjarUserId from "../utils/getHotjarUserId";
import getExperiments from "../utils/getExperiments";

type RevertToOldSiteStripProps = {};

const RevertToOldSiteStrip: FC<RevertToOldSiteStripProps> = (): ReturnType<
  typeof Box
> => {
  const { showModal } = useModalContext();

  const askForFeedbackBeforeRevert = React.useCallback(() => {
    showModal({
      headerString: "Quick thoughts?",
      content() {
        const [reason, setReason] = React.useState(null as Nullable<string>);
        const selectReason = [
          "savedCalcs",
          "estimates",
          "display",
          "other",
        ].reduce((acc, rDesc) => {
          acc[rDesc] = React.useCallback(() => {
            setReason(rDesc);
          }, [setReason]);
          return acc;
        }, {} as ObjRecord<() => void>);
        const [message, setFeedback] = React.useState("");
        const updateFeedback = React.useCallback(
          (e: any) => setFeedback(e.target.value),
          [setFeedback]
        );
        const {
          value: loading,
          enable: setIsLoading,
          disable: setNotLoading,
        } = useToggleState();
        const formRef = React.useRef<Nullable<HTMLFormElement>>(null);
        const trackRevert = useDispaction(analyticsActions.revertToOld);

        const breakpoint = useBreakpoint();
        const router = useRouter();
        const submitAndRedirect = React.useCallback(
          (e: FormEvent) => {
            e.preventDefault();
            trackRevert();

            const { current: formElement } = formRef;
            if (formElement && !loading) {
              const path = router.asPath;
              setIsLoading();
              // if (!message && !reason && document) {
              //   document.location.href = `${SITE.V2_ORIGIN}/?beta_opt_out=1`;
              //   return;
              // } else if (message || reason) {
              // todo: IE compatibility
              fetch("/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: message || "NA",
                  reason,
                  breakpoint,
                  experiments: getExperiments().join("; "),
                  hotjarUserId: getHotjarUserId(),
                  formType: "revert-feedback",
                  path,
                }),
              })
                .then((resp) => {
                  setNotLoading();
                  router.push(`${SITE.V2_ORIGIN}/?beta_opt_out=1`);
                  if (!resp.ok) throw Error("Not received");
                })
                .catch(() => {
                  setNotLoading();
                  router.push(`${SITE.V2_ORIGIN}/?beta_opt_out=1`);
                });
              // }
            }
          },
          [message, reason, router, loading, breakpoint]
        );

        return (
          <>
            <T content mb={1}>
              If you've got a moment, let us know why you're switching back.
            </T>
            <form ref={formRef} onSubmit={submitAndRedirect}>
              <Box className={css.reasons}>
                <Box className={css._row}>
                  <T tagName="label" content-pragmatic>
                    <input
                      type="radio"
                      name="reason"
                      id="reason-estimates"
                      checked={reason === "estimates"}
                      onClick={selectReason.estimates}
                    />{" "}
                    Issues with calculation estimates
                  </T>
                </Box>
                <Box className={css._row}>
                  <T tagName="label" content-pragmatic>
                    <input
                      type="radio"
                      name="reason"
                      id="reason-display"
                      checked={reason === "display"}
                      onClick={selectReason.display}
                    />{" "}
                    Interface or display issues
                  </T>
                </Box>
                <Box className={css._row}>
                  <T tagName="label" content-pragmatic>
                    <input
                      type="radio"
                      name="reason"
                      id="reason-other"
                      checked={reason === "other"}
                      onClick={selectReason.other}
                    />{" "}
                    Other reason
                  </T>
                </Box>
                <Box className={css._row}>
                  <T tagName="label" content-pragmatic>
                    <input
                      type="radio"
                      name="reason"
                      id="reason-calcs"
                      checked={reason === "savedCalcs"}
                      onClick={selectReason.savedCalcs}
                    />{" "}
                    I couldn't find my previous calculations
                  </T>
                </Box>
                <Box mt={1}>
                  <T content-fields-set-label mb={1 / 2}>
                    Comments
                  </T>
                  <textarea
                    value={message}
                    placeholder="(optional)"
                    onChange={updateFeedback}
                    className={css.messageBox}
                  ></textarea>
                </Box>
                <Button
                  text="Continue to old site"
                  secondary
                  type="submit"
                  loading={loading}
                />
              </Box>
            </form>
          </>
        );
      },
    });
  }, [showModal]);

  return (
    <Box className={css.betaOptOutCtnr} flexPri="center">
      <Box className={css._betaOptOut} flexPri="center" flexSec="center">
        <T h4 mb={1 / 2}>
          You're previewing the new OPC
        </T>
        <T
          className={css._backTo}
          content
          clickable
          onClick={askForFeedbackBeforeRevert}
        >
          Return to the old site
        </T>
      </Box>
    </Box>
  );
};

export default RevertToOldSiteStrip;
