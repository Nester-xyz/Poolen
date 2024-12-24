export const CutString = (input: string, breakAt: number) => {
  return input.length > breakAt ? input.slice(0, breakAt) + "..." : input;
};

export const ConvertToCoin = (input: string) => {
  return `$` + input.toUpperCase();
};
