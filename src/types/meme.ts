export interface MemeCoin {
  id: string;
  name: string;
  symbol: string;
  hash: string;
  totalWagered: bigint;
  pickCount: number;
  openPrice: bigint;
  closePrice: bigint;
} 