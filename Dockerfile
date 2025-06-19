FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN cp -r ./src/templates ./dist/templates

FROM node:20
WORKDIR /app

# --- AQUI ESTA LA CLAVE ---
# Instalar las dependencias de sistema necesarias para Puppeteer/Chromium
# Se han eliminado 'libxshmfence6' y 'libindicator7' que causaban el error "Unable to locate package".
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    xdg-utils \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libgconf-2-4 \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm install --omit=dev

COPY .env .env

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server.js"]