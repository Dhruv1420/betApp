import { useEffect, useState } from 'react';

interface GeneratedBet {
  betId: string;
  generatedNumber: number;
  updatedAmount: number;
  timestamp: string;
}

interface BetHistoryProps {
  betId?: string; // Optional prop to filter by specific bet
}

const BetHistory = ({ betId }: BetHistoryProps) => {
  const [bets, setBets] = useState<GeneratedBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const url = betId 
          ? `/api/v1/bet/history/${betId}`
          : '/api/v1/bet/history';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch bet history');
        
        const data = await response.json();
        setBets(data.generatedBets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [betId]);

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="text-gray-500">Loading bet history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div>
        <h1>Bet History</h1>
      </div>
      <div>
        <div className="space-y-4">
          {bets.map((bet, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
            >
              <div className="space-y-1">
                <div className="text-sm text-gray-500">
                  Generated Number
                </div>
                <div className="font-semibold">
                  {bet.generatedNumber}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">
                  Amount
                </div>
                <div className="font-semibold">
                  ${bet.updatedAmount.toFixed(2)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">
                  Time
                </div>
                <div className="text-sm">
                  {new Date(bet.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          {bets.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No bet history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetHistory;