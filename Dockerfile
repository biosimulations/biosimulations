#############
### build ###
#############

# base image
FROM node:12.11.1-alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app
COPY ./CRBM-Viz /app

# install and cache app dependencies
COPY CRBM-Viz/package.json /app/package.json
RUN npm install -g @angular/cli
RUN npm install


# generate build
RUN ng build --output-path=dist

############
### prod ###
############

# base image
FROM nginx:alpine

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
