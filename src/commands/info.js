const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder().setName('info').setDescription('A propos du bot'),
  async execute(interaction) {
    let embed = new EmbedBuilder();
    embed = embed
      .setTitle('Serge Lama - Discord bot')
      .addFields(
        { name: 'Version', value: version },
        { name: 'Github', value: 'https://github.com/Xelzs/serge-lama-bot' }
      )
      .setColor('#12AD12')
      .setFooter({
        text: 'Développé par Axel SIMONET',
        iconURL: 'https://avatars.githubusercontent.com/u/32241342?v=4',
      });

    await interaction.reply({ embeds: [embed] });
  },
};
