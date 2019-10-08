FROM alpine:latest
RUN apk update
RUN apk fix
RUN apk add nodejs
RUN apk add nodejs-npm
RUN npm install -g @angular/cli
RUN mkdir -p /var/opt/angular

RUN mkdir /code
WORKDIR /code

# Copying requirements
COPY ./CRBM-Viz/  CRBM-Viz/


WORKDIR /code/CRBM-Viz

RUN npm ci
