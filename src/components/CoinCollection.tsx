import { TBetCard } from "../types/list";
import { MemeCoin } from "../types/meme";
import bonsaiImage from '../assets/Bonsai.jpeg';
import pointlessImage from '../assets/Pointless.jpeg';

interface CoinCollectionProps {
  card: TBetCard;
  selectedCoin: string | null;
  onCoinSelect: (id: string) => void;
  isLoading: boolean;
  memeCoins: MemeCoin[];
}

const getImageForName = (name: string): string => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('bonsai')) return bonsaiImage;
  return pointlessImage;
};

const CoinCollection = ({
  selectedCoin,
  onCoinSelect,
  isLoading,
  memeCoins
}: CoinCollectionProps) => {
  if (isLoading) {
    return <div className="animate-pulse h-12 bg-gray-200 rounded-lg w-48" />;
  }

  return (
    <div className="flex gap-2">
      {memeCoins.map((coin) => (
        <button
          key={coin.id}
          onClick={() => onCoinSelect(coin.id)}
          className={`relative flex flex-col items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200
            ${selectedCoin === coin.id 
              ? 'border-purple-500 bg-purple-50 text-purple-700' 
              : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
            }
            w-[110px] md:w-[120px]`}
        >
          <div className="flex flex-col items-center gap-1">
            <img 
              src={getImageForName(coin.name)} 
              alt={coin.name} 
              className="w-8 h-8"
            />
            <span className="font-medium text-sm md:text-base text-center break-words">
              {coin.name}
            </span>
          </div>
          {selectedCoin === coin.id && (
            <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1">
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default CoinCollection;
