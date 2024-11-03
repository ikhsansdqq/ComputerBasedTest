# Stage 1: Build the application
FROM node:21-alpine AS builder

# Set environment to production for this stage
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./

# Install production dependencies first to leverage Docker layer caching
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Install devDependencies for building
RUN npm install

# Build the Next.js application
RUN npm run build

# Remove devDependencies and clean npm cache to reduce image size
RUN npm prune --omit=dev && npm cache clean --force

# Stage 2: Create the final runtime image
FROM node:21-alpine

# Set environment to production for the final stage
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port and set max memory usage
EXPOSE 8080
ENV NODE_OPTIONS="--max-old-space-size=256"

# Run the application
CMD ["npm", "run", "start"]
