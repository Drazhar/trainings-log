FROM node:14.14.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm audit fix

EXPOSE 3000

CMD [ "node", "server.js"]