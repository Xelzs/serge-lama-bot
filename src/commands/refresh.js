const { SlashCommandBuilder } = require('@discordjs/builders');
const { Planning } = require('../planning');

module.exports = {
  data: new SlashCommandBuilder().setName('refresh').setDescription('Force le rafraîchissement des données'),
  async execute(interaction) {
    await Planning.refresh();
    await interaction.reply(`Mise à jour des données terminée`);
  },
};
