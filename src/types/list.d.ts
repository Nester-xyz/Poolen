export type TBetOption = {
  name: string;
  description: string;
  icon: string;
  growth: number;
  pickedRate: number;
};

export type TBetCard = {
  prizePool: number;
  options: TBetOption[];
};
