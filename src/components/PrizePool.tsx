const PrizePool = ({ isClicked }: { isClicked: boolean }) => {
  return (
    <div
      className={`${isClicked ? "text-purple-700 font-semibold" : "text-gray-800"} text-center py-2 border shadow-lg my-2`}
    >
      <div className="text-4xl font-bold">200</div>
      <div className="text-lg">$NEST</div>
    </div>
  );
};

export default PrizePool;
