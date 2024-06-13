-- CreateEnum
CREATE TYPE "CryptoInstrumentType" AS ENUM ('SPOT', 'PERPETUAL');

-- CreateEnum
CREATE TYPE "SymbolFromType" AS ENUM ('BINANCE_SPOT', 'BINANCE_USD_M_FUT', 'BINANCE_COIN_M_FUT');

-- CreateTable
CREATE TABLE "crypto_instruments" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "type" "CryptoInstrumentType" NOT NULL,
    "symbolFrom" "SymbolFromType" NOT NULL,

    CONSTRAINT "crypto_instruments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crypto_instruments_commonName_key" ON "crypto_instruments"("commonName");
