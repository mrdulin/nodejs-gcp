FROM node:8.9-alpine

ENV PORT=8080
WORKDIR /app
COPY ./ /app/

RUN apk update \
  && apk add curl --no-cache \
  && npm i -g npm@latest \
  && npm i --production

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT} || exit 1

EXPOSE ${PORT}
CMD [ "npm", "start" ]