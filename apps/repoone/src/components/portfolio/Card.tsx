import { type ReactNode } from "react";

export const chartColors = [
  "#D61F69",
  "#16BDCA",
  "#FDBA8C",
  "#1C64F2",
  "#FDBA8C",
  "#6875F5",
];

export type ChartData = {
  color: string;
  symbol: string;
  quantity: number;
};

export type CardProps = {
  children: ReactNode[];
};

export default function Card({ children }: CardProps) {
  return (
    <div className="flex flex-col items-center gap-8 rounded-lg bg-white p-8 shadow sm:flex-row">
      {children}
    </div>
  );
}
