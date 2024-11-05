import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Bet } from "../types/types";
import BottomNav from "../components/Header";
import { server } from "../contants/keys";

const socket = io(`${server}`);

export default function UserComponent() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get<Bet[]>(`${server}/api/v1/bets`, {
          headers: {
            Accept: "application/json",
          },
        });
        if (Array.isArray(response.data)) {
          setBets(response.data);
        } else {
          console.error("API did not return an array:", response.data);
          setError("Failed to fetch bets: Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching bets:", err);
        setError(
          "Failed to fetch bets. Please check your API endpoint and server configuration."
        );
      }
    };

    fetchBets();

    socket.on("newGeneratedNumber", (data) => {
      setBets((prevBets) =>
        prevBets.map((bet) => {
          if (bet._id === data.betId) {
            return {
              ...bet,
              generatedNumbers: [
                ...bet.generatedNumbers,
                {
                  generatedNumber: data.generatedNumber,
                  updatedAmount: parseFloat(data.updatedAmount),
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return bet;
        })
      );
    });

    socket.on("betStopped", (data) => {
      setBets((prevBets) =>
        prevBets.map((bet) => {
          if (bet._id === data.betId) {
            return {
              ...bet,
              status: "completed",
              generatedNumbers: [
                ...bet.generatedNumbers,
                {
                  generatedNumber: data.lastGeneratedNumber,
                  updatedAmount: parseFloat(data.finalAmount),
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return bet;
        })
      );
    });

    return () => {
      socket.off("newGeneratedNumber");
      socket.off("betStopped");
    };
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

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
              {bets.map((bet) => (
                <React.Fragment key={bet._id}>
                  {bet.generatedNumbers
                    .slice() // Create a shallow copy to avoid mutating the original array
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    ) // Sort by timestamp (latest first)
                    .map((gen, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 text-center px-4 border-b">
                          {gen.generatedNumber}
                        </td>
                        <td className="py-2 text-center px-4 border-b">
                          {gen.updatedAmount.toFixed(2)}
                        </td>
                        <td className="py-2 text-center px-4 border-b">
                          {new Date(gen.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
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
