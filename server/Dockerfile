FROM node:14-alpine3.14

WORKDIR /app/server
COPY . /app/server/
RUN npm install -g typescript
RUN npm install -g ts-node 

CMD [ "npm" , "start" ]
