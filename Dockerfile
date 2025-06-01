FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN cp -r ./src/templates ./dist/templates

FROM node:20
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm install --omit=dev

COPY .env .env

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/server.js"]