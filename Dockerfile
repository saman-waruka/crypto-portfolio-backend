FROM node:18-alpine AS BUILDER

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=BUILDER /app/node_modules ./node_modules
COPY --from=BUILDER /app/dist ./

CMD node main.js
EXPOSE 3000
