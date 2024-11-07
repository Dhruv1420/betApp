import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import BottomNav from "../components/Header";
import { server } from "../contants/keys";
import { RootState } from "../redux/store";

// Initialize socket connection
const socket = io(`${server}`);

const WagerDetails: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [profit, setProfit] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [number, setNumber] = useState<number | null>(null);

  useEffect(() => {
    socket.on("betStopped", (data) => {
      console.log(data);
      setProfit(data.profit);
      setAmount(data.finalAmount);
      setNumber(data.lastGeneratedNumber);
    });

    return () => {
      socket.off("betStopped");
    };
  }, []);

  const details = [
    { label: "User ID:", value: user?._id },
    { label: "User Name:", value: user?.name },
    { label: "Play Type:", value: "Credit" },
    { label: "Lottery Type:", value: "Srpk10" },
    { label: "Play Type:", value: "Sum: First2 Digit" },
    { label: "Bet Time:", value: "2021-05-04 16:26:09" },
    // { label: "Times:", value: "59785 times(0.01 INR)" },
    // { label: "Wager:", value: "1 wager" },
    { label: "Amount:", value: amount ? amount : `0.00` },
    { label: "Selected Number:", value: `${number}` },
    { label: "Status:", value: "Won" },
    {
      label: "Profit:",
      value: profit ? `${profit.toFixed(2)}` : "Calculating...",
    },
  ];

  // const lotteryNumbers = [3, 1, 8, 6, 5, 10, 9, 2, 7, 4];

  return (
    <>
      <div className="bg-[#4e44ce] py-8 text-white text-center font-bold text-5xl">
        Lottery Result
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-5xl lg:mt-28 mt-12 mx-auto border">
        <div className="p-4 space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">{detail.label}</span>
              <span
                className={`font-semibold ${
                  detail.label === "Status:" && detail.value === "Won"
                    ? "text-green-600"
                    : ""
                }`}
              >
                {detail.value}
              </span>
            </div>
          ))}

          {/* Lottery Numbers
          <div className="flex items-center justify-between space-x-2">
            <span className="text-gray-600">Lottery No.:</span>
            <div className="flex space-x-1">
              {lotteryNumbers.map((number, index) => (
                <div
                  key={index}
                  className="bg-[#4e44ce] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold"
                >
                  {number}
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default WagerDetails;
