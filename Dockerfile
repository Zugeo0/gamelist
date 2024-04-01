FROM node:18 as build

WORKDIR /src

COPY frontend/package*.json ./
RUN npm i

COPY frontend/* ./
ENV VITE_API_URL /api
RUN npm run build

FROM golang:1.22-alpine

WORKDIR /usr/src/app

COPY backend/go.mod backend/go.sum* ./
RUN go mod download && go mod verify

COPY backend/* .
RUN go build -v -o /usr/local/bin/app ./....

COPY --from=build /src/dist frontend

CMD app
