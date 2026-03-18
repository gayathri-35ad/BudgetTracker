# Use an official Node runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application
# RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
