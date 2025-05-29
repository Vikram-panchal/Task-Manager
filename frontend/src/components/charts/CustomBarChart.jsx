import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CustomeToolTips from "./CustomeToolTips";

const getBarColors = (entry) => {
  // console.log(entry)
  switch (entry?.priority) {
    case "Low":
      return "#A8E6A3";
    case "Medium":
      return "#FE9900";
    case "High":
      return "#FF1F57";
    default:
      return "#A8E6A3";
  }
};

const CustomeToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-semibold text-purple-800 mb-1">
          {payload[0].payload.priority}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-900">
            {payload[0].payload.count}
          </span>
        </p>
      </div>
    );
  }
  return null;
};
const CustomBarChart = ({ data }) => {
  // console.log(data);
  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis
            dataKey="count" // Change this to 'count'
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />

          <Tooltip
            content={<CustomeToolTip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="count"
            nameKey="priority"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
            activeStyle={{ fill: "green" }}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColors(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
