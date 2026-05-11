// =============================================================================
//  ② ASYNCHRONOUS COMMUNICATION DEMO — RabbitMQ Event Consumer
// =============================================================================
//
//  This module connects to RabbitMQ and listens for events published by
//  other microservices:
//
//    - "user.registered"  → published by auth-service after a new signup
//    - "order.created"    → published by order-service after a new order
//
//  When an event is received, it creates a Notification record in MongoDB.
//  This is a textbook example of asynchronous inter-service communication
//  using a message broker (RabbitMQ).
//
//  Pattern: Publisher/Subscriber with Topic Exchange
//  Exchange: "artisanashop_events" (shared by all services)
//  Queue: "notification_queue" (exclusive to this service)
//
// =============================================================================

const amqp = require('amqplib');
const Notification = require('../models/Notification');

let connection = null;
let channel = null;

const EXCHANGE = 'artisanashop_events';
const QUEUE = 'notification_queue';

// ---------------------------------------------------------------------------
// Event Handlers — process each event type
// ---------------------------------------------------------------------------

const handleUserRegistered = async (data) => {
  console.log('──────────────────────────────────────────────────');
  console.log('📥 EVENT RECEIVED: user.registered');
  console.log(`   User: ${data.name} (${data.email})`);
  console.log('──────────────────────────────────────────────────');

  await Notification.create({
    type: 'user.registered',
    message: `Nouvel utilisateur inscrit : ${data.name} (${data.email})`,
    data: {
      userId: data.userId,
      name: data.name,
      email: data.email,
    },
  });

  console.log('   ✅ Notification saved to database');
};

const handleOrderCreated = async (data) => {
  console.log('──────────────────────────────────────────────────');
  console.log('📥 EVENT RECEIVED: order.created');
  console.log(`   Order: ${data.orderId} — ${data.totalAmount} DH`);
  console.log(`   Items: ${data.items.length} article(s)`);
  console.log('──────────────────────────────────────────────────');

  await Notification.create({
    type: 'order.created',
    message: `Nouvelle commande #${data.orderId} — ${data.totalAmount} DH (${data.items.length} articles)`,
    data: {
      orderId: data.orderId,
      userId: data.userId,
      userEmail: data.userEmail,
      totalAmount: data.totalAmount,
      itemCount: data.items.length,
    },
  });

  console.log('   ✅ Notification saved to database');
};

// ---------------------------------------------------------------------------
// Route incoming messages to the appropriate handler
// ---------------------------------------------------------------------------
const routeEvent = async (routingKey, data) => {
  switch (routingKey) {
    case 'user.registered':
      await handleUserRegistered(data);
      break;
    case 'order.created':
      await handleOrderCreated(data);
      break;
    default:
      console.log(`⚠️  Unknown event type: ${routingKey}`);
  }
};

// ---------------------------------------------------------------------------
// connectRabbitMQ — connect and start consuming events
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

      // Assert our queue (durable = survives broker restarts)
      await channel.assertQueue(QUEUE, { durable: true });

      // Bind our queue to the events we care about
      await channel.bindQueue(QUEUE, EXCHANGE, 'user.registered');
      await channel.bindQueue(QUEUE, EXCHANGE, 'order.created');

      // Start consuming messages
      channel.consume(QUEUE, async (msg) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;

            await routeEvent(routingKey, data);

            // Acknowledge the message (remove from queue)
            channel.ack(msg);
          } catch (error) {
            console.error('❌ Error processing message:', error.message);
            // Reject and don't requeue to avoid infinite loops
            channel.nack(msg, false, false);
          }
        }
      });

      console.log('✅ Notification Service connected to RabbitMQ');
      console.log(`   📥 Consuming from queue: "${QUEUE}"`);
      console.log('   📌 Listening for: user.registered, order.created');
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

module.exports = { connectRabbitMQ };
