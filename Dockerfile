FROM node:12.19.0-stretch-slim as build
WORKDIR /app
ADD . /app
RUN npm install && \
    npx tsc

FROM node:12.19.0-stretch-slim as app
WORKDIR /app
ADD . /app
RUN npm install --production
COPY --from=build /app/dist /app/dist
CMD node dist/cli.js
