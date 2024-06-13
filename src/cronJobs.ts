// cron job to update the crypto instruments
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const spot_url = 'https://api.binance.com/api/v3/exchangeInfo';
const usd_m_fut_url = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
const coin_m_fut_url = 'https://dapi.binance.com/dapi/v1/exchangeInfo';

const prisma = new PrismaClient();

async function main() {
  await insertSpotMarketData();
  await insertUsdMFutMarketData();
  await insertCoinMFutMarketData();
}

async function insertSpotMarketData() {
  const spotResponse = await axios.get(spot_url);
  const symbols = spotResponse.data.symbols || [];
  const cryptoSymbolDetailsList: any = [];

  symbols.forEach((symbolDetail: any) => {
    cryptoSymbolDetailsList.push({
      symbol: symbolDetail.symbol || '',
      commonName: `${symbolDetail.symbol || ''} SPOT`,
      base: symbolDetail.baseAsset || '',
      quote: symbolDetail.quoteAsset || '',
      type: 'SPOT',
      symbolFrom: 'BINANCE_SPOT',
    });
  });

  const { count } = await prisma.cryptoInstrument.createMany({
    data: cryptoSymbolDetailsList,
  });
  console.log(`Inserted ${count} spot instruments`);
}

async function insertUsdMFutMarketData() {
  const usdMFutResponse = await axios.get(usd_m_fut_url);
  const symbols = (usdMFutResponse.data.symbols || []).filter(
    (sym: any) => sym.contractType === 'PERPETUAL',
  );
  const cryptoSymbolDetailsList: any = [];

  symbols.forEach((symbolDetail: any) => {
    cryptoSymbolDetailsList.push({
      symbol: symbolDetail.symbol || '',
      commonName: `${symbolDetail.symbol || ''} PERP`,
      base: symbolDetail.baseAsset || '',
      quote: symbolDetail.quoteAsset || '',
      type: 'PERPETUAL',
      symbolFrom: 'BINANCE_USD_M_FUT',
    });
  });

  const { count } = await prisma.cryptoInstrument.createMany({
    data: cryptoSymbolDetailsList,
  });

  console.log(`Inserted ${count} usd m fut instruments`);
}

async function insertCoinMFutMarketData() {
  const coinMFutResponse = await axios.get(coin_m_fut_url);
  const symbols = (coinMFutResponse.data.symbols || []).filter(
    (sym: any) => sym.contractType === 'PERPETUAL',
  );
  const cryptoSymbolDetailsList: any = [];

  symbols.forEach((symbolDetail: any) => {
    cryptoSymbolDetailsList.push({
      symbol: symbolDetail.symbol || '',
      commonName: `${symbolDetail.symbol || ''} PERP`,
      base: symbolDetail.baseAsset || '',
      quote: symbolDetail.quoteAsset || '',
      type: 'PERPETUAL',
      symbolFrom: 'BINANCE_COIN_M_FUT',
    });
  });

  const { count } = await prisma.cryptoInstrument.createMany({
    data: cryptoSymbolDetailsList,
  });

  console.log(`Inserted ${count} coin m fut instruments`);
}

main();
