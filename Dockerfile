# Dockerfile (dev)
FROM node:20-alpine

WORKDIR /app

# Install deps first for better caching
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy the rest
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
