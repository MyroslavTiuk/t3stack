import { type FC } from "react";
import React from "react";
import { pipe, groupBy, mapObjIndexed } from "ramda";

import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";

import { type ExpirySelectorProps } from "./ExpirySelector.props";
import useExpiryChoices from "../../OptionLeg/utils/useExpiryChoices";
import { type ExpiryChoice } from "../../OptionLeg/OptionLeg.props";
import useDependentMemo from "../../../../../../utils/Hooks/useDependentMemo";

import css from "./ExpirySelector.module.scss";
import { MM_TO_MMM } from "../../../../../../utils/String/DateFormat/DateFormat";
import orUndef from "../../../../../../utils/Data/orUndef/orUndef";

const categoriseExpiryChoices = pipe(
  // @ts-ignore
  groupBy((expiryChoice: ExpiryChoice) => expiryChoice.dateCode.substr(0, 4)),
  mapObjIndexed(
    groupBy((expiryChoice: ExpiryChoice) => expiryChoice.dateCode.substr(4, 2))
  )
);

const ExpirySelector: FC<ExpirySelectorProps> = (
  props: ExpirySelectorProps
): ReturnType<typeof Box> => {
  const expiryChoices: ExpiryChoice[] = useExpiryChoices(props.prices, false);
  const categorisedExpiries = useDependentMemo(categoriseExpiryChoices, [
    expiryChoices,
  ]);
  const catXYearsIdx = React.useMemo(
    // @ts-ignore
    () => Object.keys(categorisedExpiries),
    [categorisedExpiries]
  );
  const catXMonthsIdxByYear = React.useMemo(
    // returns { YYYY: monthstring[] }
    () =>
      mapObjIndexed<{ [i: string]: ExpiryChoice[] }, string[]>(
        (byYear) =>
          Object.keys(byYear).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)),
        // @ts-ignore
        categorisedExpiries
      ),
    [categorisedExpiries]
  );

  return (
    <Box className={["flex flex-col lg:flex-row", css["expiry-selector"]]}>
      {catXYearsIdx.map((yyyy) => (
        <Box
          key={yyyy}
          className={[
            "flex w-full max-w-[300px] flex-wrap gap-y-2 lg:w-max lg:max-w-max lg:flex-nowrap",
            css["_years"],
          ]}
        >
          <T
            content-tag
            anemic
            className={["--sec-center flex", css["_year-title"]]}
          >
            {yyyy}
          </T>
          {catXMonthsIdxByYear[yyyy]?.map((mm) => (
            <Box
              key={mm}
              className={[
                css["_months"],
                orUndef(
                  yyyy === props.curExpiry?.slice(0, 4) &&
                    mm === props.curExpiry?.slice(4, 6) &&
                    css["--current"]
                ),
              ]}
            >
              <T
                key={mm}
                content-tag
                tagName="p"
                className={css["_month-title"]}
              >
                {MM_TO_MMM[mm] || "N/A"}
              </T>
              <Box className={["--pri-stretch flex", css["_date-ctnr"]]}>
                {
                  // @ts-ignore
                  categorisedExpiries[yyyy]?.[mm].map((dd: any) => (
                    <T
                      key={dd.dateCode}
                      className={[
                        css["_day"],
                        orUndef(
                          dd.dateCode === props.curExpiry && css["--current"]
                        ),
                      ]}
                      content-pragmatic
                      onClick={() => props.onSelectExpiry(dd.dateCode)}
                    >
                      {dd.dateCode.substr(6, 2)}
                    </T>
                  ))
                }
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ExpirySelector;
