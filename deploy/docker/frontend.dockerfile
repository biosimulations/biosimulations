# The app to build, by default the main front end
ARG app=biosimulations-frontend
#############
### base ###
#############
FROM node:12-alpine as base

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install nrwl cli 
RUN npm install -g @nrwl/cli

# install and cache app dependencies
COPY biosimulations/package.json /app/package.json
COPY biosimulations/package-lock.json /app/package-lock.json

#############
### build ###
#############
from base as build
#The app to build
ARG app
# install the app, including the dev dependencies
RUN npm ci

# add directory 
COPY ./biosimulations /app

# generate build
RUN nx build ${app} --output-path=dist --prod

#############
### Serve ###
#############
# base image
FROM nginx:alpine

ARG port=80
ENV PORT=$port
COPY  --from=build /app/dist /usr/share/nginx/html
RUN chown -R nginx /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/
#The default port is defined in the conf file for nginx. However, if $PORT env var is defined, it will be overwritten with that
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'