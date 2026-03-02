FROM node:16-alpine

WORKDIR /app

# Install git for npm packages that need it
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install backend dependencies with npm ci (more reliable than npm install)
RUN npm ci --production || npm install --production

# Copy backend source
COPY server.js ./
COPY Routes/ ./Routes/
COPY Model/ ./Model/
COPY Controller/ ./Controller/
COPY config/ ./config/
COPY validation/ ./validation/
COPY propertyCtrl.js ./

# Copy pre-built frontend (already in your repo)
COPY frontend/build ./frontend/build

# Expose port
EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server.js"]
