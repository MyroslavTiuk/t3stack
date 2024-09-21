import { type RouteDef } from "opc-types/lib/api/_RouteDef";

export interface UserProfilePublicProps {
  route: RouteDef;
}

interface UserProfileCalcedProps {
  // add props
}

export type UserProfileProps = UserProfilePublicProps & UserProfileCalcedProps;
