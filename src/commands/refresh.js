const { SlashCommandBuilder } = require('@discordjs/builders');
const { Planning } = require('../planning');

module.exports = {
  data: new SlashCommandBuilder().setName('refresh').setDescription('Force refresh data'),
  async execute(interaction) {
    await Planning.refresh();
    await interaction.reply(`Data updated successfully`);
  },
};
