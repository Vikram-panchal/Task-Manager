import React from "react";

const CustomeToolTips = ({ active, payload }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { status, count } = payload[0].payload;
    // console.log(payload[0].payload);
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-semibold text-purple-800 mb-1">
          {status}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-900">
            {count}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomeToolTips;
