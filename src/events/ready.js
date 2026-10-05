const { REST, Routes } = require('discord.js');
const { ensureHoneypotMessage } = require('../utils/setup');
const { startChannelRotation } = require('../utils/channelRotation');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    const commands = [...client.commands.values()].map((cmd) => cmd.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    } catch (error) {
      console.error('Komut kaydı başarısız:', error);
    }
    try {
      console.log(`Honeypot kanalı kontrol ediliyor: ${client.settings.honeypotChannelId}`);
      await ensureHoneypotMessage(client);
      console.log(`Ceza modu: ${client.settings.action} (son ${client.settings.deleteMessageSeconds} saniyenin mesajları silinir)`);
    } catch (error) {
      console.error('Honeypot mesajı kurulamadı:', error);
    }
    const rotation = startChannelRotation(client);
    if (rotation) {
      console.log(`Rastgele kanal ismi açık (her ${client.settings.channelRenameIntervalMinutes} dakikada bir)`);
    } else {
      console.log('Rastgele kanal ismi kapalı');
    }
    console.log(`${client.user.username} aktif!`);
  },
};
