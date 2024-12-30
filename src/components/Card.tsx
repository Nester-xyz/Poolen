import { TBetCard } from "../types/list";
import CoinCollection from "./CoinCollection";
import PrizePool from "./PrizePool";
import Question from "./Questiont";

const Card = ({ card, isClicked }: { card: TBetCard; isClicked: boolean }) => {
  if (!card) return null;

  return (
    <div
      className={`w-full border ${
        isClicked
          ? "border-purple-600 shadow-xl bg-gradient-to-r from-purple-100 to-purple-50"
          : "border-gray-300 bg-white"
      } rounded-tl-3xl rounded-br-3xl px-6 py-6 transition-all duration-300 ease-in-out cursor-pointer
      hover:shadow-lg hover:border-purple-400`}
    >
      <Question isClicked={isClicked} />
      {/* <ValidUntil isClicked={isClicked} /> */}
      <PrizePool isClicked={isClicked} />
      <CoinCollection card={card} isClicked={isClicked} />
    </div>
  );
};

export default Card;
