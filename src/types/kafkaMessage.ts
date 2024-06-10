export interface KafkaMessage {
  bid: number;
  bidQty: number;
  ask: number;
  askQty: number;
  ltp: number;
  last_traded_quantity: number;
  symbol: string;
  last_trade_time: string;
  vol: number;
  oi: number;
}
