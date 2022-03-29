FROM node:16 as build

WORKDIR /app

# Copy package configs
COPY package.json .
COPY services/common/package.json services/common/
COPY services/auth/package.json services/auth/

# Install dependencies
RUN yarn install

# Build common dependencies
COPY services/common services/common
RUN yarn workspace @deckery/common build

# Run application
COPY services/auth services/auth
CMD yarn workspace @deckery/auth dev

