-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('Call', 'Put');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Short', 'Long');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "stripeCustomerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Stock" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "lastTrade" DOUBLE PRECISION NOT NULL,
    "volume" BIGINT NOT NULL,
    "lastSale" DOUBLE PRECISION NOT NULL,
    "previousClose" DOUBLE PRECISION NOT NULL,
    "dollarVolume" DOUBLE PRECISION NOT NULL,
    "netChange" DOUBLE PRECISION NOT NULL,
    "percentChange" DOUBLE PRECISION NOT NULL,
    "retrievedAt" TIMESTAMPTZ(6) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceSource" TEXT NOT NULL,
    "numOptions" INTEGER NOT NULL,
    "peRatio" DOUBLE PRECISION,
    "marketCap" DOUBLE PRECISION,
    "dividendAmount" DOUBLE PRECISION,
    "dividendYield" DOUBLE PRECISION,
    "beta" DOUBLE PRECISION,
    "nextEarningsDate" TIMESTAMP(3),

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "expiration" TIMESTAMPTZ(6) NOT NULL,
    "strikePrice" DOUBLE PRECISION NOT NULL,
    "optionType" "OptionType" NOT NULL,
    "lastPrice" DOUBLE PRECISION NOT NULL,
    "volume" BIGINT NOT NULL,
    "askPrice" DOUBLE PRECISION NOT NULL,
    "askSize" BIGINT NOT NULL,
    "bidPrice" DOUBLE PRECISION NOT NULL,
    "bidSize" BIGINT NOT NULL,
    "openInterest" BIGINT NOT NULL,
    "retrievedAt" TIMESTAMPTZ(6) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceSource" TEXT NOT NULL,
    "daysToExpiration" DOUBLE PRECISION NOT NULL,
    "iv" DOUBLE PRECISION NOT NULL,
    "ivMeta" JSONB,
    "d1" DOUBLE PRECISION NOT NULL,
    "d2" DOUBLE PRECISION NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "gamma" DOUBLE PRECISION NOT NULL,
    "theta" DOUBLE PRECISION NOT NULL,
    "vega" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeSetup" (
    "strategy" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "optionIds" TEXT[],
    "iv" DOUBLE PRECISION,
    "otmPercent" DOUBLE PRECISION,
    "pop" DOUBLE PRECISION,
    "bidAskSpread" DOUBLE PRECISION,
    "netCredit" DOUBLE PRECISION,
    "daysToExpiration" DOUBLE PRECISION,
    "volume" BIGINT,
    "roi" DOUBLE PRECISION,
    "retrievedAt" TIMESTAMPTZ(6) NOT NULL,
    "symbol" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "TradeSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionHistory" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "expiration" TIMESTAMPTZ(6) NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "stockPrice" DOUBLE PRECISION NOT NULL,
    "optionType" "OptionType" NOT NULL,
    "lastPrice" DOUBLE PRECISION NOT NULL,
    "strikePrice" DOUBLE PRECISION NOT NULL,
    "bidPrice" DOUBLE PRECISION NOT NULL,
    "askPrice" DOUBLE PRECISION NOT NULL,
    "volume" BIGINT NOT NULL,
    "openInterest" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceSource" TEXT NOT NULL,
    "iv" DOUBLE PRECISION NOT NULL,
    "ivMeta" JSONB,
    "delta" DOUBLE PRECISION NOT NULL,
    "gamma" DOUBLE PRECISION NOT NULL,
    "theta" DOUBLE PRECISION NOT NULL,
    "vega" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OptionHistory_pkey" PRIMARY KEY ("symbol","date")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "symbol" TEXT NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" BIGINT NOT NULL,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("symbol","date")
);

-- CreateTable
CREATE TABLE "SavedOption" (
    "id" TEXT NOT NULL,
    "optionType" "OptionType" NOT NULL,
    "position" "Position" NOT NULL,
    "contractsCount" INTEGER NOT NULL,
    "strikePrice" DOUBLE PRECISION NOT NULL,
    "optionPrice" DOUBLE PRECISION NOT NULL,
    "stockPrice" DOUBLE PRECISION NOT NULL,
    "tradeDate" TIMESTAMPTZ(6) NOT NULL,
    "expiration" TIMESTAMPTZ(6) NOT NULL,
    "iv" DOUBLE PRECISION,
    "symbol" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedEquity" (
    "id" TEXT NOT NULL,
    "position" "Position" NOT NULL,
    "shares" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedEquity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedTrade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pop" DOUBLE PRECISION,
    "netCredit" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedTrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "OptionHistory_strikePrice_expiration_idx" ON "OptionHistory"("strikePrice", "expiration");

-- CreateIndex
CREATE UNIQUE INDEX "SavedEquity_tradeId_key" ON "SavedEquity"("tradeId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeSetup" ADD CONSTRAINT "TradeSetup_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOption" ADD CONSTRAINT "SavedOption_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "SavedTrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedOption" ADD CONSTRAINT "SavedOption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedEquity" ADD CONSTRAINT "SavedEquity_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "SavedTrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedEquity" ADD CONSTRAINT "SavedEquity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTrade" ADD CONSTRAINT "SavedTrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
