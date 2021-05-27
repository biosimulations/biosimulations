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

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]