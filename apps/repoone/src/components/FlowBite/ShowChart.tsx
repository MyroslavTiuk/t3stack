import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
  XAxis,
} from "recharts";

interface ProfitChartProps {
  data: { name: string; profit: number }[];
}

const ProfitChart = ({ data }: ProfitChartProps) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          width={200}
          height={60}
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1C64F2" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#1C64F2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="linear"
            dataKey="profit"
            stroke="#1C64F2"
            fill="url(#colorUv)"
            strokeWidth={4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;
