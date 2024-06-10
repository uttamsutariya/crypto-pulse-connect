import KafkaConsumer from './services/kafkaConsumer';
import WebSocketServer from './services/WebSocketServer';
import { KafkaMessage } from './types/kafkaMessage';

const start = async (): Promise<void> => {
  const kafkaConsumer = new KafkaConsumer();
  const websocketServer = new WebSocketServer();

  await kafkaConsumer.connect();
  websocketServer.start();

  kafkaConsumer.consume((message: KafkaMessage) => {
    const { symbol } = message;
    websocketServer.broadcast(symbol, message);
  });
};

start().catch(console.error);
