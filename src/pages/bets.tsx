import { useEffect, useState } from "react";
import { getData } from "../api/getData";
import { TBetCard } from "../types/list";
import Card from "../components/Card";

const BetPostCollection = () => {
  const [data, setData] = useState<TBetCard[]>([]);
  const [clickedId, setClickedId] = useState(0);

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  return (
    <div className="px-2 ">
      {/* Triangle */}
      {/* <Card card={data[0]} isClicked={true} /> */}
      <div className="relative flex flex-col gap-2">
        {data.map((card, i) => {
          return (
            <div onClick={() => setClickedId((prev) => (prev === i ? -1 : i))}>
              <Card card={card} key={i} isClicked={clickedId === i} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BetPostCollection;
