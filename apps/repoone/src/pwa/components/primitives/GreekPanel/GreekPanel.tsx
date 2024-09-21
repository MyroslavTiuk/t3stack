import { type FC } from "react";
import React from "react";
import { isNil } from "ramda";

import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";
import type Box from "../Box";
import T from "../Typo";
import ObjectKeys from "../../../../utils/Data/ObjectKeys/ObjectKeys";

import css from "./GreekPanel.module.scss";

type GreekPanelProps = {
  greeks: ObjRecord<Nullable<number>>;
};

const GreekPanel: FC<GreekPanelProps> = (
  props: GreekPanelProps
): ReturnType<typeof Box> => {
  return (
    <>
      <table className={css.table}>
        <thead>
          <tr>
            {ObjectKeys(props.greeks).map((key) => (
              <th key={key}>
                <T className={css.thText}>{key}</T>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {ObjectKeys(props.greeks).map((key) => (
              <td key={key}>
                <T className={[css.tdText, "align-right"]} content-detail>
                  {isNil(props.greeks[key]) ? "–" : props.greeks[key]}
                </T>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default GreekPanel;
