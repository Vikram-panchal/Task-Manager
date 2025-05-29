import React from "react";

const InfoCard = ({ label, value, color }) => {
  return (
    <div className="flex items-center justyfy-center gap-3">
      <div className={`w-2 h-4 md:h-5 text-center ${color} rounded`}>
      </div>
        <p className="text-xs md:text-[14px] text-gray-500">
          <span className="text-sm md:text-[15px] text-black font-semibold">
            {value}
          </span>
        </p>
      {label}
    </div>
  );
};

export default InfoCard;
