import { Kafka, EachMessagePayload, Consumer } from 'kafkajs';
import config from '../utils/config';
import { KafkaMessage } from '../types/kafkaMessage';

class KafkaConsumer {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
    });
    this.consumer = this.kafka.consumer({ groupId: 'crypto-group' });
  }

  async connect(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: config.kafka.topic,
      fromBeginning: false,
    });
  }

  async consume(
    messageHandler: (message: KafkaMessage) => void,
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        const value = message.value?.toString();
        if (value) {
          const parsedMessage: KafkaMessage = JSON.parse(value);
          messageHandler(parsedMessage);
        }
      },
    });
  }
}

export default KafkaConsumer;
