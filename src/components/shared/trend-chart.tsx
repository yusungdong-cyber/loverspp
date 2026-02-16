"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TrendChartProps {
  topics: {
    title: string;
    trendScore: number;
    keyword: string;
  }[];
}

const COLORS = [
  "hsl(221.2, 83.2%, 53.3%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(340, 75%, 55%)",
];

export function TrendChart({ topics }: TrendChartProps) {
  const data = topics.map((t, i) => ({
    name: t.keyword.length > 20 ? t.keyword.slice(0, 20) + "..." : t.keyword,
    score: t.trendScore,
    fullName: t.title,
    idx: i,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217.2, 32.6%, 17.5%)" />
        <XAxis
          dataKey="name"
          angle={-35}
          textAnchor="end"
          tick={{ fontSize: 11, fill: "hsl(215, 20.2%, 65.1%)" }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "hsl(215, 20.2%, 65.1%)" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(222.2, 84%, 4.9%)",
            border: "1px solid hsl(217.2, 32.6%, 17.5%)",
            borderRadius: "8px",
            color: "hsl(210, 40%, 98%)",
          }}
          formatter={(value: number) => [`${value}`, "Trend Score"]}
          labelFormatter={(_label: string, payload: Array<{ payload?: { fullName?: string } }>) =>
            payload?.[0]?.payload?.fullName || _label
          }
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
