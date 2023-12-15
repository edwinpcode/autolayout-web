# nodejs as builder
FROM node:16-alpine as builder
MAINTAINER Jefri Herdi Triyanto
LABEL org.opencontainers.image.authors="jefriherditriyanto@gmail.com"

# make the folder
RUN mkdir /react-app
WORKDIR /react-app
COPY . .

# Install the dependencies
RUN yarn install

# Build the project and copy the files
RUN yarn build

# ----------------------------------------------------------------------

FROM nginx:1.16.0-alpine

#!/bin/sh

COPY ./nginx.conf /etc/nginx/nginx.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /react-app/dist /usr/share/nginx/html

# 🚫 Remove Meta Files & Folders
RUN ls -a &&\
  rm -rf dist &&\
  rm -rf node_modules

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
