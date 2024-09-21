import { type ReactNode } from "react";
import { type RouteDef } from "opc-types/lib/api/_RouteDef";

export interface AuthGuardOptions {
  allowAnon?: boolean;
  allowAuthed?: boolean;
  allowUserGroups?: string[];
  redirectAuthed?: RouteDef;
  redirectAnon?: RouteDef;
  redirectCustom?: (role: string) => RouteDef;
}

export type AuthGuardPublicProps = {
  children: ReactNode;
} & AuthGuardOptions;
