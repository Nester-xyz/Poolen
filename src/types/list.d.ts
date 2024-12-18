export type TBetOption = {
  name: string;
  icon: string;
  growth: number;
  pickedRate: number;
  pickedCount: number;
};

export type TBetCard = {
  prizePool: number;
  options: TBetOption[];
};
