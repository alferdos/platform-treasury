FROM node:16

WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install dependencies without optional packages
RUN npm install --no-optional --force 2>&1 || npm install --force

# Copy backend source
COPY server.js ./
COPY Routes/ ./Routes/
COPY Model/ ./Model/
COPY Controller/ ./Controller/
COPY config/ ./config/
COPY validation/ ./validation/
COPY propertyCtrl.js ./

# Copy pre-built frontend
COPY frontend/build ./frontend/build

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server.js"]
