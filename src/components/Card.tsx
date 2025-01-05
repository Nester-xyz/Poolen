import { TBetCard } from "../types/list.ts";
import CoinCollection from "./CoinCollection";
import PricePool from "./PrizePool";
import Question from "./Questiont";
import { useState, useEffect } from "react";
import { useMemeMelee } from "../hooks/useMemeMelee";
import { parseEther } from 'viem';
import TimeRemaining from "./TimeRemaining.tsx";

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

const Card = ({
  card,
  isClicked,
  onExpand
}: {
  card: TBetCard;
  isClicked: boolean;
  onExpand: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [betAmount, setBetAmount] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
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

    loadMemeDetails();
  }, [memeHashes, getMemeDetails]);

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
      await pickMeme(selectedMeme.hash, wagerAmount);

      // Reset form after successful bet
      setBetAmount("");
      setSelectedCoin(null);
    } catch (error) {
      console.error('Error placing bet:', error);
    } finally {
      setIsLoading(false);
    }
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

  // Get selected coin symbol
  const getSelectedCoinSymbol = () => {
    const selectedMeme = memeCoins.find(coin => coin.id === selectedCoin);
    return selectedMeme?.symbol || 'coin';
  };

  // Determine loading state from contract interactions
  const isTransactionPending = isPickMemePending || isPickMemeConfirming;
  const showLoadingState = isLoading || isTransactionPending;

  return (
    <div
      className={`w-full max-w-3xl mx-auto cursor-pointer ${isClicked
        ? "border-2 border-purple-600 bg-gradient-to-r from-purple-100 to-purple-50"
        : "border border-gray-300"
        } rounded-tl-3xl rounded-br-3xl transition-colors duration-200 
      bg-white`}
    >
      <div className="px-6 py-6">
        <div className="space-y-4">
          <Question isClicked={isClicked} />

          <div className="flex justify-between items-center gap-4">
            <PricePool
              memeCoins={memeCoins}
            />
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <CoinCollection
              card={card}
              isClicked={isClicked}
              selectedCoin={selectedCoin}
              onCoinSelect={handleCoinSelect}
              isLoading={isFetchingMemes}
              memeCoins={memeCoins}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <TimeRemaining endTime={roundEndTime} />
            <div>Participants: {memeCoins ? memeCoins.reduce((acc: number, meme) => acc + Number(meme.pickCount), 0) : 0}          </div>
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
                  disabled={showLoadingState || !selectedCoin || !betAmount}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 
                  ${showLoadingState || !selectedCoin || !betAmount
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
                    } flex items-center gap-2`}
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
