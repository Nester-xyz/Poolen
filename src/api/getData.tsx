import { TBetCard } from "../types/list";

const getData = async () => {
  const data: TBetCard[] = [
    {
      options: [
        { growth: 2, icon: "", name: "lum", pickedRate: 2 },
        { growth: 2, icon: "", name: "moxie", pickedRate: 2 },
        { growth: 2, icon: "", name: "higher", pickedRate: 2 },
        { growth: 2, icon: "", name: "tn10x", pickedRate: 2 },
        { growth: 2, icon: "", name: "degen", pickedRate: 2 },
        { growth: 2, icon: "", name: "mfer", pickedRate: 2 },
      ],
      prizePool: 200,
    },
    {
      options: [
        { growth: 2, icon: "", name: "lum", pickedRate: 2 },
        { growth: 2, icon: "", name: "moxie", pickedRate: 2 },
        { growth: 2, icon: "", name: "higher", pickedRate: 2 },
        { growth: 2, icon: "", name: "tn10x", pickedRate: 2 },
        { growth: 2, icon: "", name: "degen", pickedRate: 2 },
        { growth: 2, icon: "", name: "mfer", pickedRate: 2 },
      ],
      prizePool: 200,
    },
  ];

  return data;
};
