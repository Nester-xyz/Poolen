import { TBetCard } from "../types/list";

type CardProps = {
  card: TBetCard;
};
const Card = ({ card }: CardProps) => {
  return (
    <div className="w-full h-40 border border-black rounded-tl-3xl rounded-br-3xl flex justify-between items-center px-5">
      {/* <div className="border triangle absolute bg-red-200"> */}
      <div>{card.description}</div>
      <div className="grid grid-cols-2">
        {card.options.map((data, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img src={data.icon} alt="icon" className="w-8 h-8" />
                <div className="text-lg">{data.name}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="">
        <div className="text-md">Prize pool</div>
        <div className="text-5xl">{card.prizePool}</div>
        <div className="text-3xl">$NST</div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Card;
