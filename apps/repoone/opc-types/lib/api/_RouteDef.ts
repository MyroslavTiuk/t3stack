import { FC, ReactNode } from 'react';

export interface RouteDef {
  path: string;
  name?: string;
  middleware?: () => FC<{ children: ReactNode }>;
  meta?: {};
  id?: string;
}
