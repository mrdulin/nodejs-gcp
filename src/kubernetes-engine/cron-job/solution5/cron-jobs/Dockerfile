FROM node:8.9-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json /app/
COPY ./src/ /app/src/

RUN npm i --production

CMD npm start