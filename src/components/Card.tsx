import { ConvertToCoin, CutString } from "../lib/helper";
import { TBetCard } from "../types/list";

type CardProps = {
  card: TBetCard;
  isClicked: boolean;
};

const Card = ({ card, isClicked }: CardProps) => {
  return (
    <div
      className={`
        w-full border border-black rounded-tl-3xl rounded-br-3xl flex justify-between items-center px-5
        transition-all duration-300 ease-in-out cursor-pointer
        hover:shadow-lg hover:border-gray-400
        ${isClicked ? "h-40" : "h-20"}
      `}
    >
      {isClicked ? (
        <div className="grid grid-cols-5 w-full animate-fadeIn">
          <div className="col-span-4">
            <div className="transform transition-all duration-300 ease-in-out">
              {CutString(card.description, 100)}
            </div>
            <div className="grid grid-cols-4 mt-4 animate-slideUp">
              {card.options.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 transform transition-all duration-300 ease-in-out"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                      animation: "slideUp 0.3s ease-out forwards",
                    }}
                  >
                    <img
                      src={data.icon}
                      alt="icon"
                      className="w-8 h-8 rounded-full object-cover transform transition hover:scale-110"
                    />
                    <div className="text-lg">{ConvertToCoin(data.name)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-1 transform transition-all duration-300 animate-fadeIn">
            <div className="text-md">Prize pool</div>
            <div className="text-5xl">{card.prizePool}</div>
            <div className="text-3xl">$NST</div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full animate-fadeIn">
          <div className="flex-1">
            <div className="line-clamp-1 transform transition-all duration-300">
              {card.description}
            </div>
            <div className="flex gap-2 mt-1">
              {card.options.slice(0, 3).map((data, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 transform transition-all duration-300"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animation: "slideIn 0.2s ease-out forwards",
                  }}
                >
                  <img
                    src={data.icon}
                    alt="icon"
                    className="w-6 h-6 rounded-full object-cover transform transition hover:scale-110"
                  />
                  <span className="text-sm">{ConvertToCoin(data.name)}</span>
                </div>
              ))}
              {card.options.length > 3 && (
                <span className="text-sm text-gray-500 animate-fadeIn">
                  +{card.options.length - 3} more
                </span>
              )}
            </div>
          </div>
          <div className="text-right transform transition-all duration-300 animate-fadeIn">
            <div className="text-sm">Prize pool</div>
            <div className="text-2xl">{card.prizePool} $NST</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add these keyframes to your global CSS file
const styles = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Card;
