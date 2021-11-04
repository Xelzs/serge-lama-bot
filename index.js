const { Client, Intents } = require('discord.js');
const env = require('dotenv');
env.config();

const { Planning } = require('./lib/planning/planning');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('Planning bot launched !');

  Planning.setup(process.env.DB_URL, process.env.AGENDA_URL);
});

client.login(process.env.DISCORD_TOKEN);
