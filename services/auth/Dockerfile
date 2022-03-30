##########################
# Create Development image
##########################
FROM node:16 as builder

WORKDIR /app

# Copy dependency packages
COPY package.json .
COPY services/common/package.json services/common/
COPY services/auth/package.json services/auth/
RUN yarn install

# Copy source codes
COPY services/common services/common
COPY services/auth services/auth

# Build project
RUN yarn workspace @deckery/auth build

# Stat app in development mode
CMD yarn workspace @deckery/auth dev



#########################
# Create production image
#########################
FROM node:16-alpine

WORKDIR /app

# Install dependency packages
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/services/common/package.json services/common/
COPY --from=builder /app/services/auth/package.json services/auth/
RUN yarn install --prod

# Copy built projects
COPY --from=builder /app/services/common/dist services/common/dist
COPY --from=builder /app/services/auth/dist services/auth/dist

# Start app in production mode
CMD yarn workspace @deckery/auth start


