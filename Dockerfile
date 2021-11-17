FROM node:16-alpine

WORKDIR /app/planning-discord

COPY . .

RUN npm ci --only=production

ENTRYPOINT [ "npm", "run", "start" ]