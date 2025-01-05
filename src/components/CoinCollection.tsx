import React from 'react';
import { TBetCard } from "../types/list";

interface MemeCoin {
  id: string;
  name: string;
  symbol: string;
  hash: string;
  totalWagered: bigint;
  pickCount: number;
  openPrice: bigint;
  closePrice: bigint;
}

interface CoinCollectionProps {
  card: TBetCard;
  isClicked: boolean;
  selectedCoin?: string | null;
  onCoinSelect?: (coinId: string) => void;
  isLoading: boolean;
  memeCoins: MemeCoin[];
}

const getIconForName = (name: string): string => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('dog') || lowercaseName.includes('shib')) return '🐕';
  if (lowercaseName.includes('cat')) return '🐱';
  if (lowercaseName.includes('pepe') || lowercaseName.includes('frog')) return '🐸';
  if (lowercaseName.includes('wojak') || lowercaseName.includes('sad')) return '😢';
  if (lowercaseName.includes('moon')) return '🌙';
  if (lowercaseName.includes('rocket')) return '🚀';
  return '🎮'; // default icon
};

const CoinCollection: React.FC<CoinCollectionProps> = ({
  selectedCoin,
  onCoinSelect,
  isLoading,
  memeCoins
}) => {
  const handleCoinClick = (e: React.MouseEvent, coinId: string) => {
    e.stopPropagation();
    onCoinSelect?.(coinId);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-2 rounded-lg bg-gray-100 animate-pulse">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-1"></div>
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (memeCoins.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No meme coins available
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-hidden pb-2">
      {memeCoins.map((coin) => (
        <button
          key={coin.id}
          onClick={(e) => handleCoinClick(e, coin.id)}
          className={`relative group p-2 rounded-lg transition-all duration-200 
                    ${selectedCoin === coin.id
              ? 'bg-purple-100 ring-2 ring-purple-500'
              : 'hover:bg-gray-100'
            }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">{getIconForName(coin.name)}</span>
            <span className="text-xs font-medium text-gray-700">{coin.symbol}</span>
          </div>
          {selectedCoin === coin.id && (
            <div className="absolute -top-1 -right-1">
              <div className="bg-purple-500 rounded-full p-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Tooltip with additional information */}
          <div className="absolute z-10 w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none -translate-y-full -top-2 left-1/2 -translate-x-1/2">
            <div className="text-xs space-y-1">
              <p className="font-medium text-gray-900">{coin.name}</p>
              <p className="text-gray-600">
                Total Wagered: {coin.totalWagered.toString()} ETH
              </p>
              <p className="text-gray-600">
                Picks: {coin.pickCount}
              </p>
              <p className="text-gray-600">
                Open Price: {coin.openPrice.toString()}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CoinCollection;
