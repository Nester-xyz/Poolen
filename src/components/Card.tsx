import { ConvertToCoin, CutString } from "../lib/helper";
import { TBetCard } from "../types/list";

type CardProps = {
  card: TBetCard;
};
const Card = ({ card }: CardProps) => {
  return (
    <div className="w-full h-40 border border-black rounded-tl-3xl rounded-br-3xl flex justify-between items-center px-5">
      {/* <div className="border triangle absolute bg-red-200"> */}
      <div className="grid grid-cols-5">
        <div className="col-span-4">
          {CutString(card.description, 100)}
          <div className="grid grid-cols-4">
            {card.options.map((data, index) => {
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <img
                    src={data.icon}
                    alt="icon"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-lg">{ConvertToCoin(data.name)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-1">
          <div className="text-md">Prize pool</div>
          <div className="text-5xl">{card.prizePool}</div>
          <div className="text-3xl">$NST</div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Card;
