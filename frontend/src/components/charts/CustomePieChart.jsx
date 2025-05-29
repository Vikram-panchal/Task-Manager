import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomToolTips from "./CustomeToolTips";
import CustomLegend from "./CustomeLegend";

const CustomPieChart = ({ data, colors }) => {

  const filteredData = data?.filter((entry) => entry.count > 0);
  if (!filteredData || filteredData.length === 0)
    return <p>No data available</p>;

  // console.log(data);
  // console.log(colors);
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomToolTips />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
