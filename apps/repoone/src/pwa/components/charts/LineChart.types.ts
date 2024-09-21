import { type ReactElement } from "react";

export interface EntityValue {
  value: number;
  color: string;
}
export enum LegendPosition {
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
}

export interface ReferenceLineData {
  xValue?: number;
  yValue?: number;
  label: () => string | ReactElement;
  dotted?: boolean;
}

export interface LineChartData {
  xValue: number;
  [key: string]: number;
}

export interface LegendData {
  label: string;
  color: string;
  dotted?: boolean;
  thicc?: boolean;
}
