#############
### base ###
#############
FROM node:14-alpine as base

#The name of the app to build
ARG app
ARG env
ENV APP=$app
ENV ENVNAME=$env
RUN echo building ${APP}
RUN pwd
RUN ls

# add `/app/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

# install nrwl cli
RUN npm install -g @nrwl/cli

COPY biosimulations/tsconfig.base.json /app/tsconfig.base.json
COPY biosimulations/package.json /app/package.json
COPY biosimulations/package-lock.json /app/package-lock.json
COPY biosimulations/declarations.d.ts /app/declarations.d.ts

# install dependencies needed to compile canvas (needed for Vega-embed)
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache \
    python3 \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    alpine-sdk
RUN ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --no-cache-dir  --upgrade pip setuptools


# install the app, including the dev dependencies
RUN npm ci

COPY biosimulations/nx.json  /app/nx.json	
COPY biosimulations/angular.json /app/angular.json
#copy source
COPY biosimulations/libs /app/libs
COPY biosimulations/apps /app/apps

# generate build
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]