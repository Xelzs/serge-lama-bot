FROM node:16-alpine AS dev

WORKDIR /app/planning-discord

ENTRYPOINT [ "npm", "run", "watch" ]

###########################

FROM node:16-alpine as prod

WORKDIR /app/planning-discord

COPY . ./

RUN npm ci --only=production

ENTRYPOINT [ "npm", "run", "start" ]