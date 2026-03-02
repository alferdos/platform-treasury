# Build stage for frontend
FROM node:16-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build React application
RUN npm run build

# Build stage for backend and final image
FROM node:16-alpine

WORKDIR /app

# Copy package files from root
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY server.js ./
COPY Routes/ ./Routes/
COPY Model/ ./Model/
COPY Controller/ ./Controller/
COPY config/ ./config/
COPY validation/ ./validation/
COPY propertyCtrl.js ./

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose port (Railway will set PORT env var)
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
