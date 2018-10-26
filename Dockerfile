# start with the Predix Edge base alpine image
#FROM dtr.predix.io/predix-edge/alpine-amd64:3.5
FROM alpine

LABEL maintainer="Predix Edge Application Services"
LABEL hub="https://hub.docker.com"
LABEL org="https://hub.docker.com/u/predixadoption"
LABEL version="1.0.1"
LABEL support="https://forum.predix.io"
LABEL license="https://github.com/PredixDev/predix-docker-samples/blob/master/LICENSE.md"

#install nodejs into the base image
RUN apk update && apk add nodejs-current && apk add openssl && \
    rm -f /var/cache/apk/* 

RUN apk add -U nodejs-npm  && \
    rm -f /var/cache/apk/* 

# Create app directory in the image
WORKDIR /usr/src

# copy app's source files to the image
COPY src/package*.json ./
COPY src/config-simulator.json ./
COPY src/app.js ./

# pull all required node packages into the app
RUN npm install

EXPOSE 4334

# start the app
CMD [ "node", "app.js" ]