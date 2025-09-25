FROM node:18.20.2-buster


WORKDIR /

COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 8080

EXPOSE 3000



CMD ["npm", "start"]