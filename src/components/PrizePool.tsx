const PrizePool = ({ isClicked, poolAmount }: { 
  isClicked: boolean;
  poolAmount?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="text-sm font-medium">Current Pool</div>
        <div className="text-lg font-semibold">
          {poolAmount ? `${poolAmount} GRASS` : 'No bets yet'}
        </div>
      </div>
    </div>
  );
};

export default PrizePool;
