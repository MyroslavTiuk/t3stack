export type PostTdTokenResp = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
};

export type TdAmeritradeTransaction = {
  type:
    | "TRADE"
    | "RECEIVE_AND_DELIVER"
    | "DIVIDEND_OR_INTEREST"
    | "ACH_RECEIPT"
    | "ACH_DISBURSEMENT"
    | "CASH_RECEIPT"
    | "CASH_DISBURSEMENT"
    | "ELECTRONIC_FUND"
    | "WIRE_OUT"
    | "WIRE_IN"
    | "JOURNAL"
    | "MEMORANDUM"
    | "MARGIN_CALL"
    | "MONEY_MARKET"
    | "SMA_ADJUSTMENT";
  subAccount: string;
  settlementDate: string;
  orderId?: string;
  netAmount: number;
  transactionDate: string;
  orderDate: string;
  transactionSubType: string;
  transactionId: number;
  cashBalanceEffectFlag: boolean;
  description: string;
  clearingReferenceNumber?: string;
  sma?: number;
  requirementReallocationAmount?: number;
  dayTradeBuyingPowerEffect?: number;
  achStatus?: "Approved" | "Rejected" | "Cancel" | "Error";
  accruedInterest?: number;
  fees: {
    rFee: number;
    additionalFee: number;
    cdscFee: number;
    regFee: number;
    otherCharges: number;
    commission: number;
    optRegFee: number;
    secFee: number;
  };

  transactionItem: {
    accountId: number;
    amount: number;
    price: number;
    cost: number;
    instruction: string;
    parentOrderKey?: number;
    parentChildIndicator?: string;
    positionEffect?: string;
    instrument: {
      symbol: string;
      cusip: string;
      assetType: string;
      underlyingSymbol?: string;
      optionExpirationDate?: string;
      optionStrikePrice?: number;
      putCall?: string;
      description?: string;
      bondMaturityDate?: string;
      bondInterestRate?: number;
    };
  };
};

type SecuritiesAccount = {
  type: "CASH" | "MARGIN";
  accountId: string;
  roundTrips: number;
  isDayTrader: boolean;
  isClosingOnlyRestricted: boolean;
};

export type AccountData = { securitiesAccount: SecuritiesAccount };
