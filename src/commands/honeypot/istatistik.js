const {
  SlashCommandBuilder,
  EmbedBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
} = require('discord.js');
const { getCount } = require('../../utils/counter');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('istatistik')
    .setDescription('Honeypot tarafından yakalanan kullanıcı sayısını gösterir.')
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([InteractionContextType.Guild]),
  async execute(interaction) {
    const settings = interaction.client.settings;
    const embed = new EmbedBuilder()
      .setColor(0xffb300)
      .setTitle('🍯 Honeypot İstatistik')
      .setDescription(
        `Yakalanan: **${getCount()}**\nMod: \`${settings.action}\`\nKanal: <#${settings.honeypotChannelId}>`
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
