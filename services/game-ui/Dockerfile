FROM node:16 as build

WORKDIR /app

# Install dependency packages
COPY package.json package.json
COPY services/common/package.json services/common/package.json
COPY services/game-ui/package.json services/game-ui/package.json

RUN yarn workspace @deckery/game-ui install

# Copy source files
COPY services/common services/common 
COPY services/game-ui services/game-ui

# Start app
CMD yarn workspace @deckery/game-ui start


