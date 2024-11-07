import React, { useState, useEffect } from 'react';
import BottomNav from '../components/Header';
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";
import { io } from 'socket.io-client';
import { server } from '../contants/keys';

// Initialize socket connection
const socket = io(`${server}`);

const WagerDetails: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [profit, setProfit] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | null>(null);


  useEffect(() => {
    // Listen to "stopBet" event and update profit
    socket.on("betStopped", (data) => {
        console.log(data)
      setProfit(data.profit);  // Update profit from the emitted data
      setAmount(data.finalAmount); // Update amount from the emitted);  
      console.log(data.profit)
    });

    // Clean up event listener on component unmount
    return () => {
      socket.off("betStopped");
    };
  }, []);

  const details = [
    { label: 'User ID:', value: user?._id },
    { label: 'User Name:', value: user?.name },
    { label: 'Play Type:', value: 'Credit' },
    { label: 'Lottery Type:', value: 'Srpk10' },
    { label: 'Play Type:', value: 'Sum: First2 Digit' },
    { label: 'Bet Time:', value: '2021-05-04 16:26:09' },
    { label: 'Times:', value: '59785 times(0.01 INR)' },
    { label: 'Wager:', value: '1 wager' },
    { label: 'Wager Amount:', value: amount !== null ? amount : `0.00`},
    { label: 'Status:', value: 'Won' },
    { label: 'Prize:', value: '₹ 20036.1954' },
    { label: 'Profit:', value: profit !== null ? `₹ ${profit.toFixed(2)}` : 'Calculating...' },
  ];

  const lotteryNumbers = [3, 1, 8, 6, 5, 10, 9, 2, 7, 4];

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
                  detail.label === 'Status:' && detail.value === 'Won'
                    ? 'text-green-600'
                    : ''
                }`}
              >
                {detail.value}
              </span>
            </div>
          ))}

          {/* Lottery Numbers */}
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
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-gray-100 p-2 rounded-b-lg">
          <span className="text-gray-600">Details</span>
          <div className="bg-white p-2 mt-1 border rounded-md h-12 text-center">4</div>
        </div>
      </div>
      <BottomNav/>
    </>
  );
};

export default WagerDetails;
