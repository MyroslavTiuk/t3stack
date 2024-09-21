import { type RouteDef } from "opc-types/lib/api/_RouteDef";

export interface HomePublicProps {
  route: RouteDef;
}

interface HomeCalcedProps {
  loggedIn: boolean;
}

export type HomeProps = HomePublicProps & HomeCalcedProps;
