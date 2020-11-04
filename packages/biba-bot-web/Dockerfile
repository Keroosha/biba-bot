FROM node:alpine3.12 as build

COPY . /var/biba-bot-web
WORKDIR /var/biba-bot-web
RUN yarn && yarn run build

FROM node:alpine3.12 as final

COPY --from=build /var/biba-bot-web/dist /var/bot/dist
COPY --from=build /var/biba-bot-web/config.json /var/bot/config.json
COPY --from=build /var/biba-bot-web/node_modules /var/bot/node_modules

WORKDIR /var/bot

CMD ls && node dist/index.js