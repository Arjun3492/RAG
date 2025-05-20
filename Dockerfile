FROM python:3.11-slim as backend

# Backend deps
WORKDIR /app
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1 \
    nginx \
    curl \
    gnupg \
    nodejs \
    npm \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app /app/app

# Build frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Move frontend build to nginx dir
RUN mkdir -p /var/www/frontend && \
    cp -r dist/* /var/www/frontend/

# Set up Nginx
COPY --from=backend /etc/nginx /etc/nginx
RUN rm /etc/nginx/sites-enabled/default

# Add custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Supervisord config to run both services
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 80 (for Nginx)
EXPOSE 80

# Run both services
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
