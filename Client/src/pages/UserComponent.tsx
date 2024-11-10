import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import BottomNav from "../components/Header";
import { server } from "../contants/keys";

interface Bet {
  number: number;
  amount: string;
  time: number;
}

const socket = io(`${server}`);

export default function UserComponent() {
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get<Bet[]>(
          `${server}/api/v1/bet/results`,
          {
            withCredentials: true,
          }
        );
        if (response.data) {
          setBets(response.data);
        }else{
          toast.error("Failed to fetch bets");
        }
      } catch (err) {
        console.error("Error fetching bets:", err);
        toast.error(
          "Failed to fetch bets. Please check your API endpoint and server configuration."
        );
      }
    };

    fetchBets();

    socket.on("newGeneratedNumber", (data) => {
      console.log(data);
      const result: Bet = {
        number: data.generatedNumber,
        amount: data.updatedAmount,
        time: new Date().getTime(),
      };
      setBets((prev) => [result, ...prev]);
    });

    socket.on("betStopped", (data) => {
      setBets(data.tableData);
    });

    return () => {
      socket.off("newGeneratedNumber");
      socket.off("betStopped");
    };
  }, []);

  return (
    <>
      <div className="p-4 mx-auto bg-[#4e44ce] text-white flex flex-col justify-center items-center text-center shadow-md mb-4">
        <h2 className="text-4xl font-semibold mb-4">Lottery Results</h2>
        <p>
          Bets are scheduled to be placed every 5 minutes. Countdown to the next
          placement.
        </p>
      </div>
      <div className="p-4 mx-auto bg-white rounded-xl shadow-md">
        {bets.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Generated Number</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 text-center px-4 border-b">
                    {bet.number}
                  </td>
                  <td className="py-2 text-center px-4 border-b">
                    {bet.amount}
                  </td>
                  <td className="py-2 text-center px-4 border-b">
                    {new Date(bet.time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bets available at the moment.</p>
        )}
      </div>
      <BottomNav />
    </>
  );
}
