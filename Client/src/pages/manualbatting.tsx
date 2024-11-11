import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import BottomNav from "../components/Header";
import Loader from "../components/Loader";
import { server } from "../contants/keys";
import { RootState } from "../redux/store";

const ManualBettingPage = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [betAmount, setBetAmount] = useState<number>(0);
  const [userNumber, setUserNumber] = useState<number>(3);
  const [flag, setFlag] = useState<boolean>(false);

  const handleBet = async () => {
    try {
      const response = await axios.post(
        `${server}/api/v1/bet/manualbet`,
        {
          id: user?._id,
          amount: betAmount,
          number: userNumber,
        },
        { withCredentials: true }
      );

      setFlag(true);
      setBetAmount(0);
      setUserNumber(3);
      if (response.data) {
        toast.success(response.data.message);
      } else {
        toast.error("Error in processing bet");
      }
    } catch (error) {
      toast.error("Failed to place bet");
      console.error("Error placing bet:", error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-indigo-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg">
                Username: <span className="font-bold">{user?.name}</span>
              </p>
              <p className="text-lg">
                Balance: <span className="font-bold">{user?.coins}</span>
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center">Manual Betting</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label
            htmlFor="betAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Bet Amount
          </label>
          <input
            type="number"
            id="betAmount"
            value={betAmount}
            onChange={(e) =>
              setBetAmount(Math.max(0, parseInt(e.target.value)))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="userNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Choose Your Number (3-19)
          </label>
          <input
            type="number"
            id="userNumber"
            value={userNumber}
            onChange={(e) => setUserNumber(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {flag && (
          <div className="mt-2 text-green-500 text-sm italic">
            *Bet placed successfully. Please wait for the result.
          </div>
        )}

        <button
          onClick={handleBet}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Place Bet
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ManualBettingPage;
