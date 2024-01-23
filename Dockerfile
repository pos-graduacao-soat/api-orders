FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./
COPY ./src ./src
COPY ./docs ./docs
COPY ./tsconfig.json ./tsconfig.json
COPY ./knexfile.ts ./knexfile.ts
COPY ./migrations ./migrations

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
