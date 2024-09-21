import { Pie, PieChart, Cell } from "recharts";
import { type ChartData } from "~/components/portfolio/Card";

export type ChartProps = {
  data?: ChartData[];
};
export default function Chart({ data }: ChartProps) {
  return (
    <PieChart className="-rotate-90" width={280} height={280}>
      <Pie
        data={data}
        cx={140}
        cy={140}
        innerRadius={100}
        outerRadius={130}
        fill="#8884d8"
        paddingAngle={0}
        dataKey="quantity"
        blendStroke={false}
      >
        {data?.map((entry, index) => (
          <Cell stroke="none" key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
}
