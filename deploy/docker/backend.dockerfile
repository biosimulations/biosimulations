#############
### base ###
#############
FROM node:12-alpine as base

#The name of the app to build, if not provided, build the main API
ARG app=biosimulations-api
ENV APP=$app 
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
# install the app, including the dev dependencies
RUN npm ci

# add directory 
COPY ./biosimulations /app

# generate build
RUN nx build ${APP} --output-path=dist --prod

############
### prod ###
############

# base image
FROM base as prod

# install the app and include only dependencies needed to run
RUN npm ci --only=production

# copy artifact build from the 'build environment'
RUN echo app is ${APP}
COPY --from=build /app/dist/main.js main.js

CMD node main.js