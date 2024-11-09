import React from "react";
import { BetDetails } from "../pages/WagerDetails";

const BetCard: React.FC<{ bet: BetDetails }> = ({ bet }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Bet Time:</span>
        <span className="font-semibold">{bet.betTime}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Amount:</span>
        <span className="font-semibold">
          {bet.amount?.toFixed(2) || "0.00"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Selected Number:</span>
        <span className="font-semibold">{bet.selectedNumber || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Status:</span>
        <span
          className={`font-semibold ${
            bet.status === "Won" ? "text-green-600" : ""
          }`}
        >
          {bet.status}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Profit:</span>
        <span className="font-semibold">
          {bet.profit !== null ? bet.profit.toFixed(2) : "Calculating..."}
        </span>
      </div>

      {/* Lottery Numbers */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Lottery No.:</span>
        <div className="flex space-x-1">
          {bet.lotteryNumbers.map((number, index) => (
            <div
              key={index}
              className="bg-[#4e44ce] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold"
            >
              {number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BetCard;
