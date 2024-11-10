import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import BottomNav from "../components/Header";
import BetCard from "../components/cards";
import { server } from "../contants/keys";
import { RootState } from "../redux/store";

const socket = io(`${server}`);

export interface BetDetails {
  adminNumber: string;
  amount: string;
  number: number;
  status: string;
  profit: number;
  lotteryNumbers: number[];
  time: number;
}

const WagerDetails = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [bets, setBets] = useState<BetDetails[]>([]);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/bet/wagerdetails`, {
          withCredentials: true,
        });
        console.log(data);
        if (data) {
          setBets(data);
        } else {
          toast.error("Error in accesing bet details");
        }
      } catch (error) {
        toast.error("Failed to get wager details");
        console.error("Error: ", error);
      }
    };

    fetchBets();

    socket.on("newGeneratedNumber", (data) => {
      const details: BetDetails = {
        adminNumber: data.adminNumber || "-",
        amount: data.updatedAmount,
        number: data.generatedNumber,
        status: "Lose",
        profit: 0,
        lotteryNumbers: data.lotteryNumber,
        time: new Date().getTime(),
      };
      setBets((prevBets) => [details, ...prevBets]);
    });

    socket.on("betStopped", (data) => {
      const status = data.userIds.includes(user?._id) ? "Won" : "Lose";
      const profit = status === "Won" ? data.profit : 0;
      const details: BetDetails = {
        adminNumber: data.adminNumber || "-",
        amount: data.finalAmount,
        number: data.lastGeneratedNumber,
        status,
        profit,
        lotteryNumbers: data.lotteryNumbers,
        time: new Date().getTime(),
      };
      setBets((prevBets) => [details, ...prevBets]);
    });

    return () => {
      socket.off("betStopped");
      socket.off("newGeneratedNumber");
    };
  }, [user?._id]);

  return (
    <>
      <div className="bg-[#4e44ce] py-8 text-white text-center font-bold text-5xl">
        Lottery Result
      </div>
      {/* Header with User Information */}
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-5xl lg:mt-12 mt-6 mx-auto border">
        <div className="p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">User ID:</span>
            <span className="font-semibold">{user?._id || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">User Name:</span>
            <span className="font-semibold">{user?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Play Type:</span>
            <span className="font-semibold">Credit</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lottery Type:</span>
            <span className="font-semibold">Srpk10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Play Type:</span>
            <span className="font-semibold">Sum: First2 Digit</span>
          </div>
        </div>
      </div>

      {/* Bet Cards for Each Bet */}
      <div className="max-w-5xl mx-auto mt-6 space-y-4">
        {bets.map((bet, index) => (
          <BetCard key={index} bet={bet} />
        ))}
      </div>

      <BottomNav />
    </>
  );
};

export default WagerDetails;
