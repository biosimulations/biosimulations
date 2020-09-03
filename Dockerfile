#############
### base ###
#############
FROM node:14-alpine as base

#The name of the app to build
ARG app
ENV APP=$app 
RUN echo building ${APP}

# Copy over dependency list
COPY biosimulations/tsconfig.base.json /app/tsconfig.base.json
COPY biosimulations/package.json /app/package.json
COPY biosimulations/package-lock.json /app/package-lock.json
#############
### build ###
#############
from base as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install nrwl cli 
RUN npm install -g @nrwl/cli

# copy dependencies
Copy biosimulations/nx.json  /app/nx.json
Copy biosimulations/angular.json /app/angular.json


# install the app, including the dev dependencies
RUN npm ci

#copy source
Copy biosimulations/libs /app/libs
Copy biosimulations/apps /app/apps

# generate build
RUN nx build ${APP} --prod

############
### prod ###
############

# base image
FROM base as prod
WORKDIR /app
# install the app and include only dependencies needed to run
RUN npm ci --only=production

# copy artifact build from the 'build environment'
RUN echo app is ${APP}
COPY --from=build /app/dist/apps/${APP}/ .
EXPOSE 3333
CMD node main.js