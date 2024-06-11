import express from 'express';
import { Server as HttpServer } from 'http';
import { WebSocket } from 'ws';
import KafkaConsumer from './services/kafkaConsumer';
import WebSocketServer from './services/WebSocketServer';
import { KafkaMessage } from './types/kafkaMessage';
import config from './utils/config';
import restService from './services/restServer';

const app = express();
app.use(express.json());
app.use(express.raw());
app.use(express.text());
app.use(restService);

const main = async (): Promise<void> => {
  try {
    const server = new HttpServer(app);
    const kafkaConsumer = new KafkaConsumer();
    const websocketServer = new WebSocketServer(server);

    server.listen(config.http.port, async () => {
      console.log(`Server running on port ${config.http.port}`);
      await kafkaConsumer.connect();
      websocketServer.start();

      kafkaConsumer.consume((message: KafkaMessage) => {
        const { symbol } = message;
        websocketServer.broadcast(symbol, message);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

main();
