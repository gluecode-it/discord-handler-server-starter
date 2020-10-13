FROM node:12.18.4-stretch-slim as build
ARG NPM_TOKEN
WORKDIR /app
ADD . /app
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> /app/.npmrc && \
    npm install && \
    npx tsc && \
    rm -f /app/.npmrc

FROM node:12.18.4-stretch-slim as app
ARG NPM_TOKEN
ADD . /app
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> /app/.npmrc && \
    npm install --production && \
    rm -f /app/.npmrc
COPY --from=build /app/dist /app/dist
CMD node dist/cli.js