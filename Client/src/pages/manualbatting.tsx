import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/Header";
import Loader from "../components/Loader";
import { userExist } from "../redux/reducer/userReducer";
import { RootState } from "../redux/store";
import { User } from "../types/types";

const SERVER_URL =
  import.meta.env.VITE_SERVER || "https://api.victoryonline.in";

const ManualBettingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [betAmount, setBetAmount] = useState<number>(0);
  const [userNumber, setUserNumber] = useState<number>(2);
  const [generatedNumber, setGeneratedNumber] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const calculateProfit = (num: number): number => {
    if ([7, 8, 14, 15].includes(num)) return 15;
    if ([5, 6, 16, 17].includes(num)) return 22.5;
    if ([9, 10, 12, 13].includes(num)) return 11.25;
    if (num === 11) return 9;
    return 45;
  };

  const handleBet = async () => {
    if (!user) {
      setToast({ message: "User not logged in", type: "error" });
      return;
    }

    if (betAmount <= 0) {
      setToast({ message: "Bet amount must be greater than 0", type: "error" });
      return;
    }

    if (betAmount > user.coins) {
      setToast({ message: "Insufficient coins", type: "error" });
      return;
    }

    const randomNumber = Math.floor(Math.random() * (19 - 3 + 1)) + 3;
    setGeneratedNumber(randomNumber);

    const profitMultiplier = calculateProfit(userNumber);
    const isWin = userNumber === randomNumber;
    const profit = isWin ? betAmount * profitMultiplier : 0;
    const newBalance = isWin ? user.coins + profit : user.coins - betAmount;

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/v1/bet`,
        {
          amount: betAmount,
          userNumber,
          generatedNumber: randomNumber,
          profit: profit,
          newBalance: newBalance,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update user state with new balance
        dispatch(userExist({ ...user, coins: newBalance } as User));

        if (isWin) {
          setResult(`You won! Profit: ${profit}`);
        } else {
          setResult(`You lost! Amount lost: ${betAmount}`);
        }
      } else {
        setToast({ message: "Error processing bet", type: "error" });
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      setToast({ message: "Failed to place bet", type: "error" });
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-gray-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

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
            Choose Your Number (2-19)
          </label>
          <input
            type="number"
            id="userNumber"
            value={userNumber}
            onChange={(e) =>
              setUserNumber(Math.min(19, Math.max(2, parseInt(e.target.value))))
            }
            min="2"
            max="19"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          onClick={handleBet}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Place Bet
        </button>

        {generatedNumber !== null && (
          <div className="mt-4">
            <p className="text-lg">Generated Number: {generatedNumber}</p>
            <p className="text-lg font-bold">{result}</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ManualBettingPage;
