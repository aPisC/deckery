FROM node:16 as build

WORKDIR /app
# Install dependency packages
COPY package.json package.json
COPY services/common/package.json services/common/
COPY services/web-ui/package.json services/web-ui/

RUN yarn install

# Build common package
COPY services/common services/common 
RUN yarn workspace @deckery/common build

# Copy source files
COPY services/web-ui services/web-ui

# Start app
CMD yarn workspace @deckery/web-ui start

