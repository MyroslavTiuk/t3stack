import { type ReactNode } from "react";

export const chartColors = [
  "#0d9488", // teal-600
  "#f87171", // red-400
  "#fef3c7", // amber-100
  "#262626", //neutral-800
  "#1C64F2", //blue-600
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
