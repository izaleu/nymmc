# fetch npm modules on the 'big' node image, which enables git
FROM node:latest as modules
WORKDIR /srv/www/client

# todo: find out why npm install --only=prod/dev isn't working
COPY client/package*.json ./
RUN npm install

# create build artifacts using dependencies from modules
FROM node:alpine as artifacts
WORKDIR /srv/www/client

COPY --from=modules /srv/www/client/node_modules node_modules
COPY client ./

# runs webpack build in production mode
RUN npm run-script build

# copy build artifacts and start the server
FROM node:alpine
LABEL Description="code-witch" Version="0.1" Author="IZALEU"
WORKDIR /srv/www/backend

COPY backend ./
COPY --from=artifacts /srv/www/client/public public/
RUN mkdir -p data

RUN npm install
CMD ["node", "server.js"]
