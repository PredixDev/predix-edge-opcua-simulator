# start with the Predix Edge base alpine image
FROM alpine:latest as builder

RUN cat /etc/apk/repositories

#install nodejs into the base image
#use an older APK repo with openssl 1.0.2
RUN apk update && apk upgrade && apk add --repository http://dl-cdn.alpinelinux.org/alpine/v3.8/main openssl=1.0.2r-r0 && \
    rm -f /var/cache/apk/*
RUN apk add nodejs && \
    rm -f /var/cache/apk/*
RUN apk add npm && \
    rm -f /var/cache/apk/*

# Create app directory in the image
WORKDIR /usr/src/predix-edge-opcua-simulator

# copy app's source files to the image
COPY package*.json ./
COPY app.js ./

# pull all required node packages into the app
RUN npm install

FROM alpine:latest

LABEL maintainer="Predix Edge Application Services"
LABEL hub="https://hub.docker.com"
LABEL org="https://hub.docker.com/u/predixedge"
LABEL repo="predix-edge-opcua-simulator"
LABEL version="1.1.0"
LABEL support="https://forum.predix.io"
LABEL license="https://github.com/PredixDev/predix-docker-samples/blob/master/LICENSE.md"

RUN apk update && apk upgrade && apk add --repository http://dl-cdn.alpinelinux.org/alpine/v3.8/main openssl=1.0.2r-r0 && \
    rm -f /var/cache/apk/*
RUN apk add nodejs && \
    rm -f /var/cache/apk/*

COPY config ./config
COPY app.js ./
RUN mkdir -p node_modules
COPY --from=builder /usr/src/predix-edge-opcua-simulator/node_modules ./node_modules

EXPOSE 4334

# start the app
CMD [ "node", "app.js" ]
