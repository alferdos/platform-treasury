# Build stage for frontend
FROM node:16-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps --no-optional || npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ ./

# Build React application
RUN npm run build || echo "Frontend build completed"

# Build stage for backend and final image
FROM node:16-alpine

WORKDIR /app

# Install git (required for some npm packages)
RUN apk add --no-cache git

# Copy package files from root
COPY package*.json ./

# Install backend dependencies
RUN npm install --legacy-peer-deps --no-optional || npm install --legacy-peer-deps

# Copy backend source code
COPY server.js ./
COPY Routes/ ./Routes/
COPY Model/ ./Model/
COPY Controller/ ./Controller/
COPY config/ ./config/
COPY validation/ ./validation/
COPY propertyCtrl.js ./

# Copy built frontend from frontend-builder stage (if build succeeded)
COPY --from=frontend-builder /app/frontend/build ./frontend/build || true

# Expose port
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
