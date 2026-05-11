# =============================================================================
#  Dockerfile — Auth Service
# =============================================================================
#  Builds a lightweight container for the authentication microservice.
#  Uses node:18-alpine for a minimal image size (~120MB vs ~900MB for full).
# =============================================================================

FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (Docker layer caching optimization)
# This means npm install only re-runs if dependencies change
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Expose the port this service listens on
EXPOSE 5001

# Start the service
CMD ["node", "server.js"]
