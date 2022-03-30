##########################
# Create Development image
##########################
FROM node:16 as development

WORKDIR /app
# Install dependency packages
COPY package.json package.json
COPY services/common/package.json services/common/
COPY services/game-ui/package.json services/game-ui/
RUN yarn install

# Copy source codes
COPY services/common services/common
COPY services/game-ui services/game-ui

# Start app
CMD yarn workspace @deckery/game-ui start

######################
# Create Builder image
######################
FROM development as builder
RUN yarn workspace @deckery/game-ui build


#########################
# Create production image
#########################
FROM nginx:stable-alpine
WORKDIR /app

# Add server files
COPY --from=builder /app/services/game-ui/build .
RUN echo 'server { \
  listen 3000; \
  listen [::]:3000;\
  root /app;\
  location / {\
    try_files $uri /index.html;  \
  }\
}' > /etc/nginx/conf.d/default.conf

# Run server
CMD ["nginx", "-g", "daemon off;"]

