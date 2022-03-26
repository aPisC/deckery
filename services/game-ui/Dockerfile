FROM node:16 as build

# Install dependency packages
WORKDIR /app
COPY game-ui/package.json game-ui/package.json
RUN cd game-ui && npm install

# Copy source files
COPY common common 

COPY game-ui/tsconfig.json game-ui/tsconfig.json
COPY game-ui/public game-ui/public
COPY game-ui/src game-ui/src

# Start app
WORKDIR /app/game-ui
CMD [ "npm", "run", "start" ]


