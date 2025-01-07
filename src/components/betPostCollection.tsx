import { useEffect, useState } from "react";
import { getData } from "../api/getData";
import Card from "./Card";
import { TBetCard } from "../types/list";

const BetPostCollection = () => {
  const [data, setData] = useState<TBetCard[]>([]);
  

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);

  return (
    <div className="px-2">
      <Card 
        card={data[0]} 
        isClicked={true} 
        onExpand={() => {}}
      />
      <div className="relative flex flex-col gap-2">
      </div>
    </div>
  );
};

export default BetPostCollection;
