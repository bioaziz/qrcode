FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci || npm install

# Copy the rest of the source
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Default to dev; docker-compose can override the command
CMD ["npm", "run", "dev"]

