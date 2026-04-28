# Build stage
FROM node:18-alpine AS builder

RUN apk add --no-cache openssl
# Update npm to latest version
RUN npm install -g npm@latest

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema before install (needed for postinstall prisma generate)
COPY prisma ./prisma/

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Ensure Prisma client is generated
RUN npx prisma generate

# Final stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init and openssl for proper signal handling and Prisma
RUN apk add --no-cache dumb-init openssl
# Update npm in final image to match builder (prevents npm notice at runtime)
RUN npm install -g npm@11.13.0

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy application code
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Health check (use PORT env var, fallback to 3000)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
