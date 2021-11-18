const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { version } = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder().setName('info').setDescription('A propos du bot'),
  async execute(interaction) {
    let embed = new MessageEmbed();
    embed = embed
      .setTitle('Serge Lama - Discord bot')
      .addField('Version', version)
      .addField('Github', 'https://github.com/Xelzs/serge-lama-bot')
      .setImage(`https://loremflickr.com/320/240/pig,animal/all?dumbid=${Date.now()}`)
      .setColor('#28D1E7')
      .setFooter(
        'Développé par Axel SIMONET',
        'https://files.axelsimonet.fr/api/public/dl/aUMXn2A_/xelzs/logoA-small.png'
      );

    await interaction.reply({ embeds: [embed] });
  },
};
