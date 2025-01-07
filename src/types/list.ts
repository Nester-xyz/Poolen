export type TBetCard = {
  id?: number;
  title?: string;
  timeLeft?: string;
  participants?: number;
  category?: string;
  verified?: boolean;
  memeUrl?: string;
  totalPool?: string;
  endTime?: string;
  odds?: {
    yes: number;
    no: number;
  };
  prizePool: number;
  description: string;
  options: {
    growth: number;
    icon: string;
    name: string;
    pickedRate: number;
  }[];
}; 

export type TBetOption = {
  name: string;
  icon: string;
};