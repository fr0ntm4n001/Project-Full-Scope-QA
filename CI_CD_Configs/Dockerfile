# Use the latest Node.js container as the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port used by the app
EXPOSE 3000

# Start React in development mode and keep the container running
CMD ["sh"]