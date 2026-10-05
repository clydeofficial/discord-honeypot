const { MessageFlags } = require('discord.js');
const { MODERATED_COUNT_BUTTON_ID } = require('../utils/honeypotMessage');
const { getCount } = require('../utils/counter');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (interaction.isButton() && interaction.customId === MODERATED_COUNT_BUTTON_ID) {
      try {
        await interaction.reply({
          content: `🍯 Şimdiye kadar ${getCount()} kullanıcı ${client.settings.action === 'ban' ? 'banlandı' : 'softbanlandı'}.`,
          flags: MessageFlags.Ephemeral,
        });
      } catch {
      }
      return;
    }
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, { client });
    } catch (error) {
      if (error?.code === 10062) return;
      console.error(`/${interaction.commandName} komut hatası:`, error);
      try {
        if (!interaction.isRepliable()) return;
        if (interaction.deferred) {
          await interaction.editReply({ content: 'Bu komut çalıştırılırken bir hata oluştu.' });
        } else {
          await interaction.reply({ content: 'Bu komut çalıştırılırken bir hata oluştu.', flags: MessageFlags.Ephemeral });
        }
      } catch {
      }
    }
  },
};
