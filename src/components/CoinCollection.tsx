import { TBetCard } from "../types/list";

const memeCoins = [
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', icon: '🐕' },
  { id: 'shib', name: 'Shiba Inu', symbol: 'SHIB', icon: '🐕' },
  { id: 'pepe', name: 'Pepe', symbol: 'PEPE', icon: '🐸' },
  { id: 'wojak', name: 'Wojak', symbol: 'WOJ', icon: '😢' },
];

interface CoinCollectionProps {
  card: TBetCard;
  isClicked: boolean;
  selectedCoin?: string | null;
  onCoinSelect?: (coinId: string) => void;
}

const CoinCollection = ({selectedCoin, onCoinSelect }: CoinCollectionProps) => {
  const handleCoinClick = (e: React.MouseEvent, coinId: string) => {
    e.stopPropagation();
    onCoinSelect?.(coinId);
  };

  return (
    <div className="flex gap-2">
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
            <span className="text-2xl mb-1">{coin.icon}</span>
            <span className="text-xs font-medium text-gray-700">{coin.symbol}</span>
          </div>
          {selectedCoin === coin.id && (
            <div className="absolute -top-1 -right-1">
              <div className="bg-purple-500 rounded-full p-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default CoinCollection;
