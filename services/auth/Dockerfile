######################
# Create Builder image
######################
ARG DEVIMG
FROM $DEVIMG as builder

# Build project
RUN yarn workspace @deckery/auth build



#########################
# Create production image
#########################
FROM node:16-alpine

WORKDIR /app

# Install dependency packages
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/services/common-api/package.json services/common-api/
COPY --from=builder /app/services/common-interfaces/package.json services/common-interfaces/
COPY --from=builder /app/services/common-utils/package.json services/common-utils/
COPY --from=builder /app/services/auth/package.json services/auth/
RUN yarn install --prod

# Copy built projects
COPY --from=builder /app/services/common-api/dist services/common-api/dist
COPY --from=builder /app/services/common-interfaces/dist services/common-interfaces/dist
COPY --from=builder /app/services/common-utils/dist services/common-utils/dist
COPY --from=builder /app/services/auth/dist services/auth/dist

# Start app in production mode
CMD yarn workspace @deckery/auth start
