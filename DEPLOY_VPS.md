---
description: Deploy ValorDolarPaul to a VPS (Ubuntu/Debian)
---

This guide explains how to deploy the application to a VPS.

## Prerequisites
- A VPS (e.g., DigitalOcean, AWS EC2) with Ubuntu installed.
- SSH access to the server.
- A domain name (optional but recommended).

## Option 1: Easy Method (Docker)

1.  **Install Docker** on your VPS:
    ```bash
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    ```

2.  **Create a Dockerfile** in your project (I can create this for you if you want):
    ```dockerfile
    FROM node:18-alpine as BUILD_IMAGE
    WORKDIR /app
    COPY package.json .
    RUN npm install
    COPY . .
    RUN npm run build

    FROM nginx:alpine
    COPY --from=BUILD_IMAGE /app/dist /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    ```

3.  **Build and Run**:
    ```bash
    docker build -t valordolarpaul .
    docker run -d -p 80:80 valordolarpaul
    ```

## Option 2: Manual Method (Nginx)

1.  **Install Node.js & Nginx**:
    ```bash
    sudo apt update
    sudo apt install -y nodejs npm nginx
    ```

2.  **Clone the Repo**:
    ```bash
    git clone https://github.com/PabloAmbrosini/ValorDolarPaul.git
    cd ValorDolarPaul
    ```

3.  **Build the App**:
    ```bash
    npm install
    npm run build
    ```

4.  **Configure Nginx**:
    Copy the build files to the web server directory:
    ```bash
    sudo cp -r dist/* /var/www/html/
    ```

5.  **Restart Nginx**:
    ```bash
    sudo systemctl restart nginx
    ```

Now your app will be available at your VPS IP address!
