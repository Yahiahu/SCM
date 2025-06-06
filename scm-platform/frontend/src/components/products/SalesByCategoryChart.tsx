"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Electronics", value: 400, color: "#0ea5e9" }, // sky-500
  { name: "Home Automation", value: 300, color: "#8b5cf6" }, // violet-500
  { name: "Industrial IoT", value: 200, color: "#22c55e" }, // green-500
  { name: "Mechanical Parts", value: 100, color: "#f97316" }, // orange-500
];

export function SalesByCategoryChart() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} sales`, ""]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              fontSize: "0.875rem",
            }}
            labelStyle={{ color: "#64748b" }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "0.875rem",
              color: "#475569",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
