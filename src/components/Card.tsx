import { TBetCard } from "../types/list.ts";
import { MemeCoin } from "../types/meme";
import CoinCollection from "./CoinCollection";
import PricePool from "./PrizePool";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useMemeMelee } from "../hooks/useMemeMelee";
import { parseEther } from 'viem';
import TimeRemaining from "./TimeRemaining.tsx";
import RecentBets from "./RecentBets";

interface CardProps {
  card: TBetCard;
  betAmount?: string;
  setBetAmount?: Dispatch<SetStateAction<string>>;
  isClicked: boolean;
  onExpand: () => void;
}

const Card = ({
  card,
}: CardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [memeCoins, setMemeCoins] = useState<MemeCoin[]>([]);
  const [isFetchingMemes, setIsFetchingMemes] = useState(true);

  // Get the meme-related functions from useMemeMelee
  const {
    memeHashes,
    getMemeDetails,
    pickMeme,
    roundEndTime,
    isPickMemePending,
    isPickMemeConfirming,
  } = useMemeMelee();

  // Fetch meme details when memeHashes are available
  useEffect(() => {
    const loadMemeDetails = async () => {
      if (!memeHashes) {
        setIsFetchingMemes(false);
        return;
      }

      try {
        const coinsData: MemeCoin[] = [];

        for (const hash of memeHashes) {
          const memeDetails = await getMemeDetails(hash);

          if (memeDetails && memeDetails.exists) {
            coinsData.push({
              id: hash.slice(0, 10),
              name: memeDetails.name,
              symbol: memeDetails.name.slice(0, 4).toUpperCase(),
              hash,
              totalWagered: memeDetails.totalWagered,
              pickCount: memeDetails.pickCount,
              openPrice: memeDetails.openPrice,
              closePrice: memeDetails.closePrice
            });
          }
        }

        setMemeCoins(coinsData);
      } catch (error) {
        console.error('Error loading meme details:', error);
      } finally {
        setIsFetchingMemes(false);
      }
    };

    console.log("reloading")
    loadMemeDetails();
  }, [memeHashes]);

  // Set default selected coin when memeCoins are loaded
  useEffect(() => {
    if (memeCoins.length > 0 && !selectedCoin) {
      setSelectedCoin(memeCoins[0].id);
    }
  }, [memeCoins]);

  // Update handleCoinSelect to remove expansion logic
  const handleCoinSelect = (coinId: string) => {
    setSelectedCoin(coinId === selectedCoin ? null : coinId);
  };

  if (!card) return null;

  const handlePlaceBet = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCoin || !betAmount || isLoading) return;

    setIsLoading(true);
    try {
      // Find the full meme data for the selected coin
      const selectedMeme = memeCoins.find(coin => coin.id === selectedCoin);
      if (!selectedMeme) throw new Error('Selected meme not found');

      // Convert bet amount to wei/bigint
      const wagerAmount = parseEther(betAmount);

      // Call the pickMeme function from the contract
      await pickMeme(selectedMeme.hash, wagerAmount, true);

      // Reset form after successful bet
      setBetAmount("");
      setSelectedCoin(null);
    } catch (error) {
      console.error('Error placing bet:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Determine loading state from contract interactions
  const isTransactionPending = isPickMemePending || isPickMemeConfirming;
  const showLoadingState = isLoading || isTransactionPending;

  return (
    <div className="w-full max-w-3xl mx-auto border border-gray-300 rounded-tl-3xl rounded-br-3xl 
      transition-colors duration-200 bg-white">
      <div className="px-4 md:px-6 py-6">
        <div className="text-gray-800 space-y-4">
          <div className="mb-2 text-center md:text-md">
            Which Meme coin will perform best in next 24 hours?
          </div>

          <div className="space-y-4">
            <div className="flex items-center py-4 justify-between">
              <div className="flex items-center">
                <PricePool memeCoins={memeCoins} />
              </div>
              <CoinCollection
                card={card}
                selectedCoin={selectedCoin}
                onCoinSelect={handleCoinSelect}
                isLoading={isFetchingMemes}
                memeCoins={memeCoins}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-500">
              <TimeRemaining endTime={roundEndTime as string} />
              <div>
                Participants: {memeCoins ? memeCoins.reduce((acc: number, meme) => acc + Number(meme.pickCount), 0) : 0}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d*$/.test(value)) {
                      return;
                    }
                    if (value === '') {
                      setBetAmount('');
                      return;
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      return;
                    }
                    setBetAmount(value);
                  }}
                  step="0.1"
                  placeholder="Enter bet amount"
                  disabled={showLoadingState}
                  className={`w-full px-4 py-2 pl-4 pr-16 border border-gray-200 rounded-lg 
                  focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  hover:border-purple-300 transition-all duration-200
                  placeholder:translate-y-0 placeholder:text-gray-400
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  ${showLoadingState ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  GRASS
                </span>
              </div>

              <button
                onClick={handlePlaceBet}
                disabled={showLoadingState || !selectedCoin || !betAmount}
                className={`w-full px-6 py-2 rounded-lg font-medium transition-colors duration-200 
                ${showLoadingState || !selectedCoin || !betAmount
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
                } flex items-center justify-center gap-2`}
              >
                {showLoadingState ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>
                      {isPickMemePending ? 'Confirm in wallet...' :
                        isPickMemeConfirming ? 'Processing...' :
                          'Loading...'}
                    </span>
                  </>
                ) : (
                  `Bet on ${selectedCoin ? memeCoins.find(coin => coin.id === selectedCoin)?.symbol || 'coin' : 'coin'}`
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Recent Bets
              </h3>
              <div className="max-h-[200px] overflow-y-auto">
                <RecentBets />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
