import config from '../utils/config';
import { Kafka, EachMessagePayload, Consumer, logLevel } from 'kafkajs';
import { KafkaMessage } from '../types/kafkaMessage';

class KafkaConsumer {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    console.log('Kafka broker addresses:', config.kafka.brokers);

    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
      logLevel: logLevel.INFO,
    });
    this.consumer = this.kafka.consumer({ groupId: 'crypto-group' });
  }

  async connect(): Promise<void> {
    await this.consumer
      .connect()
      .then(() => console.log('Kafka consumer connected'))
      .catch((err) => {
        console.log('Kafka Error when connecting', err);
        process.exit(1);
      });

    await this.consumer
      .subscribe({
        topic: config.kafka.topic,
        fromBeginning: false,
      })
      .then(() => console.log('Kafka subscribed to: ' + config.kafka.topic))
      .catch(() => {
        console.log('Kafka Error when subscribing');
        process.exit(1);
      });
  }

  async consume(
    messageHandler: (message: KafkaMessage) => void,
  ): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({
          topic,
          partition,
          message,
        }: EachMessagePayload) => {
          const value = message.value?.toString();
          if (value) {
            try {
              const parsedMessage: KafkaMessage = JSON.parse(value);
              messageHandler(parsedMessage);
            } catch (parseError) {
              console.error('Error parsing Kafka message:', parseError);
            }
          } else {
            console.warn('Received empty Kafka message');
          }
        },
      });
    } catch (error) {
      console.error('Error consuming Kafka messages:', error);
    }
  }
}

export default KafkaConsumer;
