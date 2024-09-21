import React, { type ReactNode } from "react";

import clx from "../../../../../../utils/Html/clx";
import T from "../../../../primitives/Typo";

import css from "../Summary.module.scss";
import nbsp from "../../../../../../utils/Html/nbsp";

export type TDStatPair = {
  label: string;
  labelClass?: string;
  note?: string | ReactNode | Element;
  noteClass?: string;
  val: string | ReactNode | Element;
  valClass?: string;
  spanTwoCols?: boolean;
  valSpansDesc?: boolean;
};

export const TdStatPair = (props: TDStatPair) => {
  const labelSpan = props.labelClass?.includes("--no-val");
  return (
    <>
      <td
        className={clx([css["_label"], css[props.labelClass || ""]])}
        colSpan={labelSpan ? (props.spanTwoCols ? 6 : 3) : undefined}
      >
        <T className={css._text}>{props.label}</T>
      </td>
      {!labelSpan && (
        <>
          <td
            className={clx([css["_val"], css[props.valClass || ""]])}
            colSpan={
              props.valSpansDesc ? (props.spanTwoCols ? 5 : 2) : undefined
            }
          >
            <T className={css._text}>
              {/*@ts-ignore*/}
              {Array.isArray(props.val) ? props.val.join(", ") : props.val}
            </T>
          </td>
          {!props.valSpansDesc && (
            <td
              className={clx([css["_note"], css[props.valClass || ""]])}
              colSpan={props.spanTwoCols ? 4 : undefined}
            >
              {props.note ? (
                // @ts-ignore
                <T className={css._text}>
                  {/*@ts-ignore*/}
                  {Array.isArray(props.note)
                    ? props.note.join(", ")
                    : props.note}
                </T>
              ) : (
                nbsp
              )}
            </td>
          )}
        </>
      )}
    </>
  );
};
