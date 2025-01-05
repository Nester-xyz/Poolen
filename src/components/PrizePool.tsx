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

const PrizePool = ({ memeCoins }: {
  memeCoins?: MemeCoin[]
}) => {
  const totalPool = memeCoins?.reduce((acc, meme) => acc + meme.totalWagered, BigInt(0)) || BigInt(0);

  // Convert to ETH format (divide by 10^18) and format to 4 decimal places
  const formattedPool = Number(totalPool) / 1e18;

  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="text-sm font-medium">Current Pool</div>
        <div className="text-lg font-semibold flex flex-row">
          {formattedPool > 0 ? `${formattedPool.toFixed(2)}    ` : 'No bets yet'}
          &ensp;
          <div className="flex justify-center items-center w-6 h-6 border-[1px] border-green-600 rounded-full text-md">
            🌱
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrizePool;
