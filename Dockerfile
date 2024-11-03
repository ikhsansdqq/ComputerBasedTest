# Stage 1: Build the application
FROM node:21-slim AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies initially (this step is cached)
RUN npm install --only=production

# Install all dependencies, including devDependencies for building
COPY . .
RUN npm install

# Build the Next.js application for production
RUN npm run build

# Stage 2: Run the application
FROM node:21-slim

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy the built application and dependencies from the builder stage
COPY --from=builder /app /app

# Expose the port that your application will run on
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "start"]
