import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { server } from "../../contants/keys";
import { betClose, betOpen } from "../../redux/reducer/betReducer";

interface ServerToClientEvents {
  betStarted: (data: { betId: string; message: string }) => void;
  betUpdate: (data: {
    betId: string;
    generatedNumber: number;
    updatedAmount: string;
  }) => void;
  betEnded: (data: { betId: string }) => void;
  betStopped: (data: {
    betId: string;
    lastGeneratedNumber: number;
    finalAmount: string;
  }) => void;
  error: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  startBet: (data: { number: number; amount: number }) => void;
  stopBet: (data: { betId: string }) => void;
}

const AdminBettingInterface = () => {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [number, setNumber] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [activeBetId, setActiveBetId] = useState<string | null>(null);
  const [generatedNumbers, setGeneratedNumbers] = useState<
    Array<{ number: number; amount: string }>
  >([]);

  const dispatch = useDispatch();

  const connectSocket = useCallback(() => {
    const newSocket = io(server, {
      path: "/socket.io/",
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      toast.success("Connected to server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      toast.error("Disconnected from server");
    });

    newSocket.on("error", (error) => {
      toast.error(error.message);
    });

    newSocket.on("betStarted", (data) => {
      setActiveBetId(data.betId);
      dispatch(betOpen());
      toast.success(data.message);
    });

    newSocket.on("betUpdate", (data) => {
      setGeneratedNumbers((prev) => [
        ...prev,
        { number: data.generatedNumber, amount: data.updatedAmount },
      ]);
    });

    newSocket.on("betEnded", () => {
      setActiveBetId(null);
      dispatch(betClose());
      toast.success("Bet ended");
    });

    newSocket.on("betStopped", (data) => {
      setActiveBetId(null);
      dispatch(betClose());
      setGeneratedNumbers((prev) => [
        ...prev,
        { number: data.lastGeneratedNumber, amount: data.finalAmount },
      ]);
      toast.success(`Bet stopped. Final amount: ${data.finalAmount}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const handleStartBet = () => {
    if (socket && isConnected) {
      socket.emit("startBet", { number, amount });
      dispatch(betOpen());
    } else {
      toast.error("Not connected to server");
    }
  };

  const handleStopBet = () => {
    if (socket && isConnected && activeBetId) {
      socket.emit("stopBet", { betId: activeBetId });
      dispatch(betClose());
    } else {
      toast.error("No active bet to stop");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Betting Interface
        </h1>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium text-gray-600">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700"
            >
              Number
            </label>
            <input
              type="number"
              id="number"
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleStartBet}
            disabled={!isConnected || activeBetId !== null}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${
              !isConnected || activeBetId !== null
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Start Bet
          </button>
          <button
            onClick={handleStopBet}
            disabled={!isConnected || activeBetId === null}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${
              !isConnected || activeBetId === null
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Stop Bet
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Numbers</h2>
          <div className="space-y-2">
            {generatedNumbers.map((gen, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span>Number: {gen.number}</span>
                <span>Amount: {gen.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBettingInterface;
