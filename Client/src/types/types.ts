export type User = {
  name: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  referalCode: string;
  referal: string;
  _id: string;
  coins: number;
  role: string;
  status: string;
  withdrawHistory: [
    {
      coins: number;
      status: string;
      accNo: string;
      ifsc: string;
      bankName: string;
      receiverName: string;
      contact: number;
    }
  ];
  paymentHistory: [
    {
      amount: number;
      referenceNumber: string;
      status: string;
    }
  ];
};

export interface updateUserReal {
  status?: string;
  coins?: number;
}

export interface ManualBet {
  number: number;
  amount: number;
  profit: number;
  userId: string;
  status: string;
}

export interface GeneratedNumber {
  generatedNumber: number;
  updatedAmount: number;
  timestamp: string;
}

export interface Bet {
  _id: string;
  number: number;
  amount: number;
  status: "active" | "completed";
  generatedNumbers: GeneratedNumber[];
  createdAt: string;
  updatedAt: string;
  time: string;
}
