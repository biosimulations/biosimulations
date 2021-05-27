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


# add `/app/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

# install nrwl cli
RUN npm install -g @nrwl/cli



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


# generate build

ENTRYPOINT ["/entrypoint.sh"]