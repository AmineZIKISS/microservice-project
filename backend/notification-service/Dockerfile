# =============================================================================
#  Dockerfile — Notification Service
# =============================================================================
#  Builds the notification microservice container.
#  This service demonstrates ASYNCHRONOUS communication:
#    ② Consumes RabbitMQ events from auth-service and order-service
# =============================================================================

FROM node:18-alpine

WORKDIR /app

# Copy package files first (Docker layer caching optimization)
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy application source code
COPY . .

# Expose the port this service listens on
EXPOSE 5004

CMD ["node", "server.js"]
