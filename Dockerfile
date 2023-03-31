FROM node:14

WORKDIR  /

COPY ./package.json ./

RUN npm install --global nodemon dotenv

COPY . . 

EXPOSE 5000

CMD  ["npm","start"]