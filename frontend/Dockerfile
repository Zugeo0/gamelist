FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npm run build
RUN cp package.json build/ && \
    cp package-lock.json build/ && \
    cp -r node_modules build/

RUN cd build && npm ci --omit dev

CMD cd build && node .