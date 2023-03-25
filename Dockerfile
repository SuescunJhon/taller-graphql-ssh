# ---- Construye la aplicación React ----
FROM node:19-alpine3.16 AS react-builder
WORKDIR /app
COPY ./saludofront-app/package*.json ./
RUN npm ci
COPY ./saludofront-app ./
RUN npm run build

# ---- Construye la aplicación Express ----
FROM node:19-alpine3.16
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY --from=react-builder /app/dist ./saludofront-app/dist
EXPOSE 4000

CMD ["node", "index.js"]
