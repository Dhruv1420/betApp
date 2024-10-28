export type User = {
  name: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  referalCode: string;
  _id: string;
  coins: number;
  role: string;
  status: string;
  withdrawHistory: [
    {
      coins: number;
      status: string;
    }
  ];
  paymentHistory: [
    {
      amount: number;
      referenceNumber: string;
    }
  ];
};

export type Bet = {
  time: string;
  number: number;
  amount: number;
};
