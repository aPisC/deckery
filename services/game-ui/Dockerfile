FROM node:16 as build

WORKDIR /app

COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY ./src src
COPY ./public public


CMD [ "npm", "run", "start" ]


