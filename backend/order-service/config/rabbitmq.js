// ---------------------------------------------------------------------------
// RabbitMQ Connection & Publisher Utility
// ---------------------------------------------------------------------------
// This module handles connecting to RabbitMQ with retry logic (essential for
// Docker, where RabbitMQ may not be ready when the service starts) and
// provides a reusable `publishEvent` function for async communication.
// ---------------------------------------------------------------------------

const amqp = require('amqplib');

let connection = null;
let channel = null;

// The exchange all Artisanashop services publish/consume from
const EXCHANGE = 'artisanashop_events';

// ---------------------------------------------------------------------------
// connectRabbitMQ — connect with retry logic for Docker startup ordering
// ---------------------------------------------------------------------------
const connectRabbitMQ = async () => {
  const maxRetries = 10;
  const retryDelay = 5000; // 5 seconds between retries

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();

      // Assert a topic exchange — topic allows routing key patterns
      // e.g., "order.created", "user.registered"
      await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

      console.log('✅ Order Service connected to RabbitMQ');
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
// publishEvent — publish a message to the exchange with a routing key
// ---------------------------------------------------------------------------
// Usage: publishEvent('order.created', { orderId: '...', ... })
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
      { persistent: true } // Survive broker restarts
    );
    console.log(`📤 Event published: ${routingKey}`, data);
  } catch (error) {
    console.error(`❌ Failed to publish event ${routingKey}:`, error.message);
  }
};

module.exports = { connectRabbitMQ, publishEvent };
