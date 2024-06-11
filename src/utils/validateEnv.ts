import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  KAFKA_CLIENT_ID: z.string(),
  KAFKA_BROKERS: z.string(),
  KAFKA_TOPIC: z.string(),
  PORT: z.string().transform((val) => parseInt(val, 10)),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Invalid environment variables:', env.error.format());
  process.exit(1);
}

export default env.data;
