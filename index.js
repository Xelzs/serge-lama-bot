const { Client, GatewayIntentBits, Collection } = require('discord.js');
const env = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
env.config();

const { Planning } = require('./src/planning');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
  try {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL);
    if (!channel) throw new Error('unable to get channel');

    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), {
      body: commands,
    });

    await Planning.setup(channel);
    console.log('Planning bot launched !');
  } catch (error) {
    console.error('Init error', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({ content: 'There was an error while executing this command !', ephemeral: true });
  }
});

process.on('SIGTERM', Planning.graceful);
process.on('SIGINT', Planning.graceful);

client.login(process.env.DISCORD_TOKEN);
