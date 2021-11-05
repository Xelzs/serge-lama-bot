# Planning Discord

## Start the bot

```sh
npm run start

# For dev only
npm run watch
```

## Run mongodb locally

```sh
docker run -it --rm --name db -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=pdiscord -e MONGO_INITDB_ROOT_PASSWORD='IamTHEpassw0rD' mongo:5
```