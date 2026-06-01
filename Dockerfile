# Build stage
FROM node:18-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files from backend
COPY src/backend/package*.json ./

# Copy prisma schema from backend
COPY src/backend/prisma ./prisma/

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Ensure Prisma client is generated
RUN npx prisma generate

# Final stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init and openssl for proper signal handling and Prisma
RUN apk add --no-cache dumb-init openssl

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy application code from backend src
COPY src/backend/src ./src

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
