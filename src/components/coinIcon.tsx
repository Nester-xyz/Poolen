import { useState } from "react";
import { TBetOption } from "../types/list";
import * as motion from "motion/react-client";

interface CoinIconProps {
  coin: TBetOption;
  isClicked: boolean;
  onClick?: () => void;
}

const CoinIcon = ({ coin, isClicked, onClick }: CoinIconProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={` relative h-10 rounded-lg border border-dotted border-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${isClicked ? "w-full" : "mx-auto w-12"} `}
      aria-label={`Select ${coin.name} coin`}
    >
      <div className="flex justify-between gap-2 mx-2 my-0.5 items-center">
        <img
          src={coin.icon}
          alt={`${coin.name} icon`}
          className={` w-8 h-8 rounded-full object-cover ${!imageLoaded || imageError ? "hidden" : "block"} `}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className={`${isClicked ? "block" : "hidden"}`}>
          {coin.name}
          {coin.name && (
            <span className="ml-1 text-gray-500">({coin.name})</span>
          )}
        </div>
        <button
          className={`px-2 py-1 bg-orange-500 rounded ${isClicked ? "block" : "hidden"}`}
          onClick={(e) => {
            console.log(e);
            e.stopPropagation();
          }}
        >
          pick
        </button>
      </div>
    </motion.div>
  );
};

export default CoinIcon;
