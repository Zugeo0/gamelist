FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

ARG API_URL

ENV VITE_API_URL=${API_URL}

RUN npm run build
CMD node server.js
