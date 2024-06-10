import env from './validateEnv';

const config = {
  kafka: {
    clientId: env.KAFKA_CLIENT_ID,
    brokers: env.KAFKA_BROKERS.split(','),
    topic: env.KAFKA_TOPIC,
  },
  websocket: {
    port: env.WEBSOCKET_PORT,
  },
};

export default config;
