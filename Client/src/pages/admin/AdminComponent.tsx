import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../../contants/keys';

type GeneratedNumber = {
  generatedNumber: number;
  updatedAmount: number;
  timestamp: string;
};

type Bet = {
  _id: string;
  number: number;
  amount: number;
  status: 'active' | 'completed';
  generatedNumbers: GeneratedNumber[];
  createdAt: string;
  updatedAt: string;
};

type BetStartedEvent = { betId: string };
type NewGeneratedNumberEvent = { betId: string; generatedNumber: number; updatedAmount: string };
type BetStoppedEvent = { betId: string; lastGeneratedNumber: number; finalAmount: string };
type ErrorEvent = { message: string };

const socket: Socket = io(`${server}`);

export default function AdminComponent() {
  const [number, setNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [bets, setBets] = useState<Bet[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get<Bet[]>(`${server}/api/v1/bets`, {
          headers: { 'Accept': 'application/json' }
        });
        if (Array.isArray(response.data)) {
          setBets(response.data);
        } else {
          console.error('API did not return an array:', response.data);
          setError('Failed to fetch bets: Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching bets:', err);
        setError('Failed to fetch bets. Please check your API endpoint and server configuration.');
      }
    };

    fetchBets();

    socket.on('betStarted', (data: BetStartedEvent) => {
      setBets(prevBets => [{
        _id: data.betId,
        number: parseInt(number),
        amount: parseFloat(amount),
        status: 'active',
        generatedNumbers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, ...prevBets]);
      setNumber('');
      setAmount('');
      setError('');
    });

    socket.on('newGeneratedNumber', (data: NewGeneratedNumberEvent) => {
      setBets(prevBets => prevBets.map(bet => {
        if (bet._id === data.betId) {
          return {
            ...bet,
            generatedNumbers: [
              ...bet.generatedNumbers,
              { 
                generatedNumber: data.generatedNumber, 
                updatedAmount: parseFloat(data.updatedAmount),
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return bet;
      }));
    });

    socket.on('betStopped', (data: BetStoppedEvent) => {
      setBets(prevBets => prevBets.map(bet => {
        if (bet._id === data.betId) {
          return {
            ...bet,
            status: 'completed',
            generatedNumbers: [
              ...bet.generatedNumbers,
              { 
                generatedNumber: data.lastGeneratedNumber, 
                updatedAmount: parseFloat(data.finalAmount),
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return bet;
      }));
    });

    socket.on('error', (data: ErrorEvent) => {
      setError(data.message);
    });

    return () => {
      socket.off('betStarted');
      socket.off('newGeneratedNumber');
      socket.off('betStopped');
      socket.off('error');
    };
  }, [number, amount]);

  const handleStartBet = () => {
    if (number && amount) {
      socket.emit('startBet', { number: parseInt(number), amount: parseFloat(amount) });
    } else {
      setError('Please enter both number and amount');
    }
  };

  const handleStopBet = (betId: string) => {
    socket.emit('stopBet', { betId });
  };

  if (error) {
   toast.error(error)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Admin Betting Control</h2>
      <div className="mb-4">
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter bet number"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter bet amount"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleStartBet}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Start New Bet
        </button>
      </div>
      {bets.length > 0 ? (
        bets.map((bet) => (
          <div key={bet._id} className="mb-8 p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Bet #{bet._id}</h3>
            <p className="mb-2">Status: {bet.status}</p>
            <p className="mb-2">Initial Number: {bet.number}</p>
            <p className="mb-2">Initial Amount: ${bet.amount.toFixed(2)}</p>
            <h4 className="text-lg font-medium mb-2">Generated Numbers:</h4>
            <ul className="list-disc pl-5">
              {bet.generatedNumbers.map((gen, index) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">Number: {gen.generatedNumber}</span>
                  <span className="ml-4">Amount: ${gen.updatedAmount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleStopBet(bet._id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Stop Bet
            </button>
          </div>
        ))
      ) : (
        <p>No bets available at the moment.</p>
      )}
    </div>
  );
}
