import { getData } from "../api/getData";
import Card from "./Card";

const BetPost = () => {
  const data = getData();
  return (
    <div className="px-2 ">
      {/* Triangle */}
      <div className="relative flex flex-col gap-2">
        {data.map((card, i) => {
          return <Card card={card} key={i} />;
        })}
      </div>
    </div>
  );
};

export default BetPost;
