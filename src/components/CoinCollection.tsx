import { TBetCard } from "../types/list";
import CoinIcon from "./coinIcon";

type CoinCollectionProps = {
  card: TBetCard;
};
const CoinCollection = ({ card }: CoinCollectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {card.options.map((coin, index) => {
        return (
          <div key={index}>
            <CoinIcon />
          </div>
        );
      })}
    </div>
  );
};

export default CoinCollection;
