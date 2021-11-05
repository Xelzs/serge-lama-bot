const { SlashCommandBuilder } = require('@discordjs/builders');
const { Planning } = require('../planning');

module.exports = {
  data: new SlashCommandBuilder().setName('next').setDescription('Affiche le prochain cours'),
  async execute(interaction) {
    const embed = await Planning.next();
    await interaction.reply({ embeds: [embed] });
  },
};
