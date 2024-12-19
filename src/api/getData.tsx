import { TBetCard } from "../types/list";

export const getData = async () => {
  const data: TBetCard[] = [
    {
      prizePool: 200,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      options: [
        {
          growth: 2,
          icon: "",
          name: "lum",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "moxie",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "higher",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "tn10x",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "degen",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "mfer",
          pickedRate: 2,
        },
      ],
    },
    {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.",
      options: [
        {
          growth: 2,
          icon: "",
          name: "lum",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "moxie",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "higher",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "tn10x",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "degen",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "",
          name: "mfer",
          pickedRate: 2,
        },
      ],
      prizePool: 200,
    },
  ];

  return data;
};
