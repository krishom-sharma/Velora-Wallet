import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency, formatMonthLabel } from "../../utils/format";

const palette = ["#1772FF", "#29C9B8", "#F59E0B", "#F97316", "#6366F1", "#14B8A6"];

export const SpendTrendChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    month: formatMonthLabel(item._id.month, item._id.year),
    spend: item.spend
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="spendGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1772FF" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#1772FF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94A3B8" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8" }} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              borderRadius: "18px",
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.86)",
              color: "#fff"
            }}
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="#1772FF"
            strokeWidth={3}
            fill="url(#spendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryDonutChart = ({ data = [] }) => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius={78}
          outerRadius={104}
          dataKey="total"
          nameKey="_id"
          paddingAngle={4}
        >
          {data.map((item, index) => (
            <Cell key={item._id} fill={palette[index % palette.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{
            borderRadius: "18px",
            border: "1px solid rgba(148,163,184,0.18)",
            background: "rgba(15,23,42,0.86)",
            color: "#fff"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
