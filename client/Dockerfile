FROM node:14-alpine3.14

COPY build ./
RUN npm install -g serve
EXPOSE 3000

CMD ["serve","-n", "-p", "3000" ,"build"]