import { type Nullable } from "errable";
import { type Strategy } from "opc-types/lib/Strategy";
import React, { type FC, type ReactElement } from "react";
import useSelectorSafe from "../../../store/selectors/useSelectorSafe";
import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";
import Box from "../../primitives/Box";
import commonCss from "../common.module.scss";
import CalculationsTable from "./CalculationsTable";
import CalculationsTableMobile from "./CalculationsTableMobile";
import css from "./Portfolio.module.scss";
import { type PortfolioProps } from "./Portfolio.props";
import usePortfolio from "./usePortfolio";

const PortfolioView: FC<PortfolioProps> = (
  _props: PortfolioProps
): ReactElement<"div"> => {
  const isMobile = useMediaQuery("mobile-only");
  const { calculationsDataTable, onDeleteCalculation, loadingCalculations } =
    usePortfolio();
  const currentCalc =
    useSelectorSafe<Nullable<Strategy>>((store) => store.currentCalculation) ||
    null;

  return (
    <Box className={[commonCss.container, css.container]}>
      {isMobile ? (
        <CalculationsTableMobile
          calculationsDataTable={calculationsDataTable}
          onDeleteCalculation={onDeleteCalculation}
          loading={loadingCalculations}
          currentCalc={currentCalc}
        />
      ) : (
        <CalculationsTable
          calculationsDataTable={calculationsDataTable}
          onDeleteCalculation={onDeleteCalculation}
        />
      )}
    </Box>
  );
};

export default PortfolioView;
