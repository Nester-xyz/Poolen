import { TBetCard, TList } from "../types/list";

const Card = ({ Card }: TBetCard) => {
  return (
    <div className="w-full h-40 border border-black rounded-tl-3xl rounded-br-3xl">
      <div className="border triangle absolute bg-red-200"></div>
    </div>
  );
};

export default Card;
