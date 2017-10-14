FROM resin/raspberry-pi-alpine-node:latest
MAINTAINER Gerard Gigliotti

# Defines our working directory in container
WORKDIR /usr/src/app

ADD . ./
RUN npm install
CMD ["node","index.js"]
