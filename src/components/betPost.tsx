import { useEffect, useState } from "react";
import { getData } from "../api/getData";
import Card from "./Card";
import { TBetCard } from "../types/list";

const BetPost = () => {
  const [data, setData] = useState<TBetCard[]>([]);

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

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
