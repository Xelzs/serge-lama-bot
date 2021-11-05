# Serge Lama - Discord Bot

Serge Lama is a discord bot created for Ynov M1 Cloud discord.

## Install the bot

- Clone the project : `git clone git@github.com:Xelzs/serge-lama-bot.git`
- Install dependencies : `npm ci`
- Set environment variables :
```
DISCORD_TOKEN=<bot_token>
DISCORD_CLIENT_ID=<bot_oauth_client_id>
DISCORD_GUILD_ID=<bot_guild_id>
DISCORD_CHANNEL=<channel_id>
AGENDA_URL=<hyperplanning_url>
DB_URL=<mongodb_connection_string>
```

## Start the bot

```sh
npm run start

# For dev only
npm run watch
```

## Run MongoDB locally

For persistence purporse, Serge Lama need a MongoDB instance running.  
You can run it locally with this example docker command. 

```sh
docker run -it --rm --name db -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=slama -e MONGO_INITDB_ROOT_PASSWORD='IamTHEpassw0rD' mongo:5
```