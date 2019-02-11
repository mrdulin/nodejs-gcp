FROM mhart/alpine-node:8.7.0

WORKDIR /app

COPY ./package.json ./package-lock.json /app/
COPY ./src/ /app/src/

RUN npm i --production

CMD [ "npm", "start" ]