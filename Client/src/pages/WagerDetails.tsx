import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import BottomNav from "../components/Header";
import BetCard from "../components/cards";
import { server } from "../contants/keys";
import { RootState } from "../redux/store";
import axios from "axios";
import toast from "react-hot-toast";

const socket = io(`${server}`);

export interface BetDetails {
  amount: number | null;
  selectedNumber: number | null;
  status: string;
  profit: number | null;
  lotteryNumbers: number[];
  betTime: string;
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

        if (data) {
          toast.success(data.message);
          const newBet: BetDetails = {
            amount: data.updatedAmount || 0.0,
            selectedNumber: data.generatedNumber || null,
            status: "Lose",
            profit: data?.profit || 0.0,
            lotteryNumbers: data.lotteryNumber,
            betTime: new Date().toISOString(),
          };
          setBets((prevBets) => [newBet, ...prevBets]);
        } else {
          toast.error("Error in processing bet");
        }
      } catch (error) {
        toast.error("Failed to place bet");
        console.error("Error placing bet:", error);
      }
    };

    fetchBets();

    socket.on("newGeneratedNumber", (data) => {
      const newBet: BetDetails = {
        amount: data.finalAmount || 0.0,
        selectedNumber: data.lastGeneratedNumber || null,
        status: "Lose",
        profit: data?.profit || 0.0,
        lotteryNumbers: data.lotteryNumber,
        betTime: new Date().toISOString(),
      };
      setBets((prevBets) => [newBet, ...prevBets]);
    })

    socket.on("betStopped", (data) => {
      const newBet: BetDetails = {
        amount: data.finalAmount || 0.0,
        selectedNumber: data.lastGeneratedNumber || null,
        status: "Won",
        profit: data.profit || 0.0,
        lotteryNumbers: data.lotteryNumber,
        betTime: new Date().toISOString(),
      };
      setBets((prevBets) => [newBet, ...prevBets]);
    });

    return () => {
      socket.off("betStopped");
      socket.off("newGeneratedNumber");
    };
  }, []);

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
