const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('anto').setDescription("Rappelle à Antonio que c'est un loser"),
  async execute(interaction) {
    const embed = new EmbedBuilder();
    embed
      .setTitle('Rakotomalalacouille')
      .setImage(
        `https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTRkYTM1YmNmMTVjOGJiZTcyYjQ2YjdhNDVjMGIyNTNkYjI0Y2RjMiZjdD1n/8AdlIamKVYo084YL4H/giphy.gif`
      )
      .setColor('#28D1E7');

    await interaction.reply({ embeds: [embed] });
  },
};
