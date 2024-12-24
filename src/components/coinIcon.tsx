const CoinIcon = () => {
  return (
    <div className="px-2 py-2 border border-dotted border-gray-700 rounded-lg group relative">
      <img
        src="https://placehold.co/600x400"
        alt="icon"
        className="w-8 h-8 rounded-full object-cover transform transition hover:scale-110"
      />
      <div className="text-xs absolute hidden group-hover:block">LUM</div>
    </div>
  );
};

export default CoinIcon;
