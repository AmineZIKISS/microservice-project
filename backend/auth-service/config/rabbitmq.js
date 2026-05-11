// ---------------------------------------------------------------------------
// RabbitMQ Connection & Publisher for Auth Service
// ---------------------------------------------------------------------------
// Publishes events when users register. The notification-service consumes
// these events asynchronously via the shared "artisanashop_events" exchange.
// ---------------------------------------------------------------------------

const amqp = require('amqplib');

let connection = null;
let channel = null;

const EXCHANGE = 'artisanashop_events';

// ---------------------------------------------------------------------------
// connectRabbitMQ — connect with retry logic for Docker startup ordering
// ---------------------------------------------------------------------------
const connectRabbitMQ = async () => {
  const maxRetries = 10;
  const retryDelay = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();

      // Assert the shared topic exchange
      await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

      console.log('✅ Auth Service connected to RabbitMQ');
      return channel;
    } catch (error) {
      console.log(
        `⏳ RabbitMQ not ready, retrying (${attempt}/${maxRetries})...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  console.error('❌ Failed to connect to RabbitMQ after max retries');
};

// ---------------------------------------------------------------------------
// publishEvent — publish a message to the topic exchange
// ---------------------------------------------------------------------------
const publishEvent = async (routingKey, data) => {
  if (!channel) {
    console.warn('⚠️  RabbitMQ channel not available, event not published');
    return;
  }

  try {
    channel.publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );
    console.log(`📤 Event published: ${routingKey}`, data);
  } catch (error) {
    console.error(`❌ Failed to publish event ${routingKey}:`, error.message);
  }
};

module.exports = { connectRabbitMQ, publishEvent };
