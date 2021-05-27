#############
### base ###
#############
FROM node:14-alpine as base

#The name of the app to build
ARG app
ARG env
ENV APP=$app
ENV ENVNAME=$env
RUN echo building ${app}
RUN echo env is $env
RUN pwd
RUN echo $GITHUB_WORKSPACE 
RUN ls

# add `/app/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

# install nrwl cli
RUN npm install -g @nrwl/cli

COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/tsconfig.base.json /tsconfig.base.json
COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/package.json /package.json
COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/package-lock.json /package-lock.json
COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/declarations.d.ts /declarations.d.ts

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

COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/nx.json  /nx.json	
COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/angular.json /angular.json
#copy source
COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/libs /libs
COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/apps /apps

# generate build
COPY /home/runner/work/Biosimulations/Biosimulations/biosimulations/tools/build-action/entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]