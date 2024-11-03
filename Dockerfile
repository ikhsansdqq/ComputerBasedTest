# Use the official Node.js LTS image from the Docker Hub
FROM node:21-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that your application will run on
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "start"]
