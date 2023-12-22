# nodejs as builder
FROM node:18-alpine as builder
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

COPY ./nginx.conf /etc/nginx/nginx.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /react-app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
