import "../styles/victory.scss";
import { Link } from "react-router-dom";
import BottomNav from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios, { AxiosError } from "axios";
import { server } from "../contants/keys";
import { useDispatch } from "react-redux";
import { userNotExist } from "../redux/reducer/userReducer";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface TableData {
  sum: number;
  scheme: number;
  period: string;
  empty: number;
  amount: string;
  status: string;
}

const tableData: TableData[] = [
  {
    sum: 19,
    scheme: 1,
    period: "20210504181",
    empty: 44,
    amount: "44",
    status: "Activated",
  },
  {
    sum: 18,
    scheme: 1,
    period: "20210504181",
    empty: 7,
    amount: "7",
    status: "Activated",
  },
  {
    sum: 17,
    scheme: 2,
    period: "20210504181",
    empty: 56,
    amount: "56",
    status: "Activated",
  },
  {
    sum: 16,
    scheme: 2,
    period: "20210504181",
    empty: 9,
    amount: "9",
    status: "Activated",
  },
  {
    sum: 15,
    scheme: 3,
    period: "20210504181",
    empty: 14,
    amount: "14",
    status: "Activated",
  },
  {
    sum: 14,
    scheme: 3,
    period: "20210504181",
    empty: 4,
    amount: "4",
    status: "Activated",
  },
  {
    sum: 13,
    scheme: 4,
    period: "20210504181",
    empty: 17,
    amount: "17",
    status: "Activated",
  },
  {
    sum: 12,
    scheme: 4,
    period: "20210504181",
    empty: 3,
    amount: "3",
    status: "Activated",
  },
  {
    sum: 11,
    scheme: 5,
    period: "20210504181",
    empty: 11,
    amount: "11",
    status: "Activated",
  },
  {
    sum: 10,
    scheme: 4,
    period: "20210504181",
    empty: 12,
    amount: "12",
    status: "Activated",
  },
  {
    sum: 9,
    scheme: 4,
    period: "20210504181",
    empty: 1,
    amount: "1",
    status: "Activated",
  },
  {
    sum: 8,
    scheme: 3,
    period: "20210504181",
    empty: 23,
    amount: "23",
    status: "Activated",
  },
  {
    sum: 7,
    scheme: 3,
    period: "20210504181",
    empty: 20,
    amount: "20",
    status: "Activated",
  },
  {
    sum: 6,
    scheme: 2,
    period: "20210504181",
    empty: 6,
    amount: "6",
    status: "Activated",
  },
  {
    sum: 5,
    scheme: 2,
    period: "20210504181",
    empty: 0,
    amount: "0",
    status: "Activated",
  },
  {
    sum: 4,
    scheme: 1,
    period: "20210504181",
    empty: 16,
    amount: "16",
    status: "Activated",
  },
  {
    sum: 3,
    scheme: 1,
    period: "20210504181",
    empty: 69,
    amount: "69",
    status: "Activated",
  },
  {
    sum: 2,
    scheme: 1,
    period: "20210504181",
    empty: 6,
    amount: "69",
    status: "Activated",
  },
];


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
  success: (data: { message: string }) => void;
  error: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  startBet: (data: { number: number; amount: number }) => void;
  stopBet: (data: { betId: string }) => void;
  activeUser: (data: { userId: string }) => void;
  inactiveUser: (data: { userId: string }) => void;
}

const App = () => {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [bet, setBet] = useState<{ number: number; amount: string }>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const dispatch = useDispatch();

  const connectSocket = useCallback(() => {
    const newSocket = io(server, {
      path: "/socket.io/",
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("success", (data) => {
      toast.success(data.message);
    });

    newSocket.on("error", (error) => {
      toast.error(error.message);
    });

    newSocket.on("betStarted", () => {
      setStart(true);
      setEnd(false);
    });

    newSocket.on("betUpdate", (data) => {
      setBet({ number: data.generatedNumber, amount: data.updatedAmount });
    });

    newSocket.on("betStopped", (data) => {
      setEnd(true);
      setStart(false);
      setBet({ number: data.lastGeneratedNumber, amount: data.finalAmount });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const startBetting = () => {
    console.log("Start betting clicked");
    console.log({ start, end, user });
    
    if (!start) return toast.error("Bet not started yet");
    if (end) return toast.error("Bet ended");
    if (user) {
      if (Number(bet?.amount) > user.coins)
        return toast.error("Insufficient coins to start a bet");
      if (user.status === "active")
        return toast.error("You are already active");
      if (user.status === "banned")
        return toast.error("You are banned, Can't start a bet");
  
      if (socket && isConnected) {
        console.log("Emitting activeUser event");
        socket.emit("activeUser", { userId: user?._id });
      } else {
        toast.error("Not connected to server");
      }
    }
  };
  
  const stopBetting = () => {
    console.log("Stop betting clicked");
    console.log({ start, end, user });
    
    if (!start) return toast.error("Bet not started yet");
    if (end) return toast.error("Bet ended");
    if (user) {
      if (user.status === "inactive")
        return toast.error("You are already inactive");
      if (user.status === "banned") return toast.error("You are banned");
  
      if (socket && isConnected) {
        console.log("Emitting inactiveUser event");
        socket.emit("inactiveUser", { userId: user?._id });
      } else {
        toast.error("Not connected to server");
      }
    }
  };
  

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      dispatch(userNotExist());
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Something Went Wrong");
      } else if (error instanceof Error) {
        toast.error(error.message || "Something Went Wrong");
      } else {
        console.log("An unknown error occurred:", error);
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="app">
      {/* Header Section */}
      <div className="header">
        <div className="user-info">
          <p>
            Username: <span className="font-bold">{user?.name}</span>
          </p>
          <p>
            Balance: <span className="font-bold">{user?.coins}</span>
          </p>
        </div>
        <p>
          Bets are scheduled to be placed every 5 minutes. Countdown to the next
          placement!
        </p>
        <Link to={"/login"} onClick={logoutHandler} className="exit-btn">
          Exit
        </Link>
      </div>

      {/* Tab Section */}
      <div className="tabs">
        {/* <button className="tab active">Plan</button>
        <button className="tab">Settings</button>
        <button className="tab">History</button>
        <button className="tab">Srpk10</button> */}
      </div>

      {/* Table Section */}
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>Sum</th>
              <th>Scheme</th>
              <th>Period</th>
              <th>Empty</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.sum}</td>
                <td>{row.scheme}</td>
                <td>{row.period}</td>
                <td>{row.empty}</td>
                <td>{row.amount}</td>
                <td>{user?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons Section */}
      <div className="buttons">
        <button className="one-click-btn open" onClick={startBetting}>
          One-click open
        </button>
        <button className="one-click-btn close" onClick={stopBetting}>
          One-click close
        </button>
      </div>
      <br />
      <br />
      <BottomNav />
    </div>
  );
};

export default App;
