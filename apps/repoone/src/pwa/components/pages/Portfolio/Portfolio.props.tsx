import { type RouteDef } from "opc-types/lib/api/_RouteDef";

export interface PortfolioPublicProps {
  route: RouteDef;
}

interface PortfolioCalcedProps {
  // add props
}

export type PortfolioProps = PortfolioPublicProps & PortfolioCalcedProps;
