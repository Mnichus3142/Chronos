FROM node:20-alpine

RUN mkdir -p /home/node/time-rush/node_modules && chown -R node:node /home/node/time-rush

WORKDIR /home/node/time-rush

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 4173

CMD ["node", "--env-file=.env", "build"]
