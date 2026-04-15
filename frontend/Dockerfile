# ========================================
# Stage 1: Build the Vite/React Frontend
# ========================================

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Set Vite environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy source code and build the static files
COPY . .
RUN npm run build

# ========================================
# Stage 2: Serve with Nginx
# ========================================

FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Vite output (from Stage 1) to the Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Nginx default port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]