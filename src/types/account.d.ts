export interface Account {
  username: {
    value: string;
  } | null;
  address: string;
}

export interface AccountManaged {
  account: Account;
}
