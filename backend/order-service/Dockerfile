# =============================================================================
#  Dockerfile — Order Service
# =============================================================================
#  Builds the order microservice container.
#  This service demonstrates BOTH communication patterns:
#    ① Synchronous — Axios HTTP calls to product-service
#    ② Asynchronous — RabbitMQ event publishing
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
EXPOSE 5003

CMD ["node", "server.js"]
