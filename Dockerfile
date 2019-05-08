FROM wenance/node-nr-vault:node8.15.0-nr4.2.0-vault-alpine-v1.2

USER root 

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY package*.json ./

USER node
RUN npm install

ENV MONGO_HOST=$MONGO_HOST

COPY --chown=node:node . .
EXPOSE 8080

CMD [ "node", "index.js" ]