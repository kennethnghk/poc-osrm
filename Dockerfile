FROM node:latest

RUN mkdir -p /var/www/app
WORKDIR /var/www/app

ADD . /var/www/app
RUN yarn

ENTRYPOINT yarn start