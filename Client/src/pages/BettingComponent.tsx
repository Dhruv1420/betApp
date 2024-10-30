import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';

const socket: Socket = io('http://localhost:3000');

interface BetStoppedData {
  lastGeneratedNumber: number;
  finalAmount: number;
}

interface GeneratedNumber {
  generatedNumber: number;
  updatedAmount: number;
  betId: string;
}

interface BetStartedData {
  betId: string;
}

interface ErrorData {
  message: string;
}

export default function BettingComponent() {
  const [number, setNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [betId, setBetId] = useState<string | null>(null);
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumber[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    socket.on('betStarted', (data: BetStartedData) => {
      setBetId(data.betId);
      setError('');
    });

    socket.on('betUpdate', async (data: GeneratedNumber) => {
      try {
        const response = await axios.get(`/api/v1/bet/${data.betId}/latest`);
        setGeneratedNumbers((prev) => [...prev, response.data]);
      } catch (err) {
        console.error('Error fetching latest generated number:', err);
      }
    });

    socket.on('betStopped', (data: BetStoppedData) => {
      if (betId) {
        setGeneratedNumbers((prev) => [
          ...prev,
          {
            generatedNumber: data.lastGeneratedNumber,
            updatedAmount: data.finalAmount,
            betId, // Include the current betId here
          },
        ]);
      }
      setBetId(null);
    });

    socket.on('error', (data: ErrorData) => {
      setError(data.message);
    });

    return () => {
      socket.off('betStarted');
      socket.off('betUpdate');
      socket.off('betStopped');
      socket.off('error');
    };
  }, [betId]);

  const handleStartBet = () => {
    socket.emit('startBet', { number: parseInt(number), amount: parseFloat(amount) });
  };

  const handleStopBet = () => {
    if (betId) {
      socket.emit('stopBet', { betId });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Betting App</h2>
      <div className="mb-4">
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter your number"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter bet amount"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleStartBet}
          disabled={betId !== null}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Start Bet
        </button>
        <button
          onClick={handleStopBet}
          disabled={betId === null}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop Bet
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <h3 className="text-xl font-semibold mb-2">Generated Numbers:</h3>
        <ul className="list-disc pl-5">
          {generatedNumbers.map((gen, index) => (
            <li key={index}>
              Number: {gen.generatedNumber}, Amount: ${gen.updatedAmount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
