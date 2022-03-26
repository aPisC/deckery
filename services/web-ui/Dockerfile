FROM node:16 as build

# Install dependency packages
WORKDIR /app
COPY web-ui/package.json web-ui/package.json
RUN cd web-ui && npm install

# Copy source files
COPY common common 

COPY web-ui/tsconfig.json web-ui/tsconfig.json
COPY web-ui/public web-ui/public
COPY web-ui/src web-ui/src

# Start app
WORKDIR /app/web-ui
CMD [ "npm", "run", "start" ]


