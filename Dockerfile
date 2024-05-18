FROM node:16 as webapp-builder

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

COPY app/ .

ENV NODE_ENV production
ARG APP_BASE_URL
RUN npm run build

FROM node:16 as server-builder

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server/ .

ENV NODE_ENV production
ARG APP_BASE_URL
RUN npm run build

FROM node:16

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY --from=webapp-builder /usr/src/app/build ./build
COPY --from=server-builder /usr/src/app/dist ./dist

ENV APP_BUILD_PATH=/usr/src/app/build/
CMD [ "node", "dist/index.js" ]