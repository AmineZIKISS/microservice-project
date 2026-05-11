# =============================================================================
#  Dockerfile — Product Service
# =============================================================================
#  Builds a lightweight container for the product catalog microservice.
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
EXPOSE 5002

CMD ["node", "server.js"]
