import { TBetCard } from "../types/list";

export const getData = async () => {
  const data: TBetCard[] = [
    {
      prizePool: 200,
      description: "Which coin will grow the most in the next 24 hrs?",
      options: [
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "lum",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "moxie",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "higher",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "tn10x",
          pickedRate: 2,
        },
      ],
    },
    {
      prizePool: 200,
      description: "Which coin will grow the most in the next 24 hrs?",
      options: [
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "lum",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "moxie",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "higher",
          pickedRate: 2,
        },
        {
          growth: 2,
          icon: "https://placehold.co/600x400",
          name: "tn10x",
          pickedRate: 2,
        },
      ],
    },
  ];

  return data;
};
