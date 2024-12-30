import { TBetCard } from "../types/list";
import * as motion from "motion/react-client";
import CoinIcon from "./coinIcon";

interface CoinCollectionProps {
  card: TBetCard;
  isClicked: boolean;
  onCoinClick?: (index: number) => void;
}

const CoinCollection = ({
  card,
  isClicked,
  onCoinClick,
}: CoinCollectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isClicked ? 0.8 : 1 }}
      className={`${isClicked ? "flex flex-col" : "grid"} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2`}
      role="group"
      aria-label="Coin collection"
    >
      {card.options.map((coin, index) => (
        <CoinIcon
          key={index}
          coin={coin}
          isClicked={isClicked}
          onClick={() => onCoinClick?.(index)}
        />
      ))}
    </motion.div>
  );
};

export default CoinCollection;
