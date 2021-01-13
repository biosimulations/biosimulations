#############
### base ###
#############
FROM node:15-alpine as base

#The name of the app to build
ARG app
ENV APP=$app
RUN echo building ${APP}
#############
### build ###
#############
FROM base as build


WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install nrwl cli
RUN npm install -g @nrwl/cli

# copy dependencies
# Copy over dependency list
COPY biosimulations/tsconfig.base.json /app/tsconfig.base.json
COPY biosimulations/package.json /app/package.json
COPY biosimulations/package-lock.json /app/package-lock.json

# set working directory

# install the app, including the dev dependencies
RUN npm ci

COPY biosimulations/nx.json  /app/nx.json	
COPY biosimulations/angular.json /app/angular.json
#copy source
COPY biosimulations/libs /app/libs
COPY biosimulations/apps /app/apps

# generate build
# Redifining the env *might* correct cache invalidtion issue
ENV APP=${APP}
RUN nx build ${APP} --prod

############
### prod ###
############

# base image
FROM base as prod
LABEL \
    org.opencontainers.image.title="BioSimulations ${APP}" \
    org.opencontainers.image.description="Docker image for the BioSimulations ${APP} app" \
    org.opencontainers.image.url="https://biosimulations.org/" \
    org.opencontainers.image.documentation="https://biosimulations.org/help" \
    org.opencontainers.image.source="https://github.com/biosimulations/Biosimulations" \
    org.opencontainers.image.authors="BioSimulations Team <info@biosimulations.org>" \
    org.opencontainers.image.vendor="BioSimulations Team" \
    org.opencontainers.image.licenses="MIT"

WORKDIR /app

#Copy over dependency list
COPY biosimulations/package.json /app/package.json
# install the app and include only dependencies needed to run
RUN npm install --only=production  --legacy-peer-deps
# copy artifact build from the 'build environment'
RUN echo app is ${APP}
COPY --from=build /app/dist/apps/${APP}/ .
EXPOSE 3333
CMD node main.js
