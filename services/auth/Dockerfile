##########################
# Create Development image
##########################
FROM node:16 as development

WORKDIR /app

# Install dependency packages
COPY package.json .
COPY services/common/package.json services/common/
COPY services/auth/package.json services/auth/
RUN yarn install

# Copy source codes
COPY services/common services/common
COPY services/auth services/auth

# Stat app in development mode
CMD yarn workspace @deckery/auth dev

######################
# Create Builder image
######################
FROM development as builder
# Build project
RUN yarn workspace @deckery/auth build

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


