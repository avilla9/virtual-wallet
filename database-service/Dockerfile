FROM node:24-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build 

FROM node:24-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist
CMD [ "npm", "run", "start" ]