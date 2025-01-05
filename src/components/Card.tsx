import { TBetCard } from "../types/list.ts";
import CoinCollection from "./CoinCollection";
import PrizePool from "./PrizePool";
import Question from "./Questiont";
import { useState } from "react";

const Card = ({ card, isClicked, onExpand }: { 
  card: TBetCard; 
  isClicked: boolean;
  onExpand: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [betAmount, setBetAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  if (!card) return null;

  const handlePlaceBet = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCoinSelect = (coinId: string) => {
    if (!isClicked) {
      onExpand();
    }
    setSelectedCoin(coinId === selectedCoin ? null : coinId);
  };

  // Get selected coin symbol from CoinCollection component
  const getSelectedCoinSymbol = () => {
    return selectedCoin?.toUpperCase() || 'coin';
  };

  return (
    <div
      className={`w-full max-w-3xl mx-auto cursor-pointer ${
        isClicked
          ? "border-2 border-purple-600 bg-gradient-to-r from-purple-100 to-purple-50"
          : "border border-gray-300"
      } rounded-tl-3xl rounded-br-3xl transition-colors duration-200 
      bg-white`}
    >
      <div className="px-6 py-6">
        <div className="space-y-4">
          <Question isClicked={isClicked} />

          <div className="flex justify-between items-center gap-4">
            <PrizePool 
              isClicked={isClicked}
            />
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <CoinCollection 
              card={card} 
              isClicked={isClicked}
              selectedCoin={selectedCoin}
              onCoinSelect={handleCoinSelect}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <div>Time Left: {card.timeLeft || "24h"}</div>
            <div>Participants: {card.participants || 0}</div>
          </div>

          {isClicked && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex gap-4" onClick={handleInputClick}>
                <div className="flex-1">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter bet amount"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    hover:border-purple-300 transition-all duration-200"
                  />
                </div>
                <button
                  onClick={handlePlaceBet}
                  disabled={isLoading || !selectedCoin}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 
                  ${
                    isLoading || !selectedCoin
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
                  } flex items-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    `Bet on ${getSelectedCoinSymbol()}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
