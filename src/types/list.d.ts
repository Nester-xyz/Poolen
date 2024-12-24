export type TBetOption = {
  name: string;
  icon: string;
  growth: number;
  pickedRate: number;
};

export type TBetCard = {
  description: string;
  prizePool: number;
  options: TBetOption[];
};
