# Build stage (optional, but good practice)
FROM node:18-alpine AS builder

# Production stage - serve static files with Nginx
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the frontend files to Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY scripts.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
