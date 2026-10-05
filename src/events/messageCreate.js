const { PermissionsBitField } = require('discord.js');
const { applyHoneypotAction } = require('../utils/moderation');
const { sendHoneypotLog } = require('../utils/logger');
const { increment } = require('../utils/counter');
const { refreshHoneypotCounter } = require('../utils/setup');

module.exports = {
  name: 'messageCreate',
  async execute(client, message) {
    try {
      const settings = client.settings;
      if (message.channelId !== settings.honeypotChannelId) return;
      if (!message.guild) return;
      if (message.author.bot) return;
      if (message.system) return;
      const guild = message.guild;
      const member = message.member ?? (await guild.members.fetch(message.author.id).catch(() => null));
      const user = message.author;
      await message.delete().catch(() => null);
      if (user.id === guild.ownerId) return;
      if (member && member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;
      const me = await guild.members.fetchMe().catch(() => null);
      if (me && member && me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
        console.error(`Yetki hiyerarşisi yetersiz: ${user.tag} (${user.id}) cezalandırılamadı.`);
        await sendHoneypotLog({
          client,
          logChannelId: settings.logChannelId,
          honeypotChannelId: settings.honeypotChannelId,
          guild,
          user,
          member,
          actionText: 'cezalandırılamadı (rol hiyerarşisi yetersiz)',
        }).catch(() => null);
        return;
      }
      const reason = `Honeypot tuzağı tetiklendi: #${message.channel.name ?? 'honeypot'} (${message.channelId})`;
      const result = await applyHoneypotAction({
        guild,
        userId: user.id,
        action: settings.action,
        deleteMessageSeconds: settings.deleteMessageSeconds,
        reason,
      });
      const count = increment();
      await refreshHoneypotCounter(client).catch(() => null);
      await sendHoneypotLog({
        client,
        logChannelId: settings.logChannelId,
        honeypotChannelId: settings.honeypotChannelId,
        guild,
        user,
        member,
        actionText: result === 'banned' ? 'banlandı' : 'softbanlandı',
      });
      console.log(`🍯 Honeypot tetiklendi: ${user.tag} (${user.id}) -> ${result} (#${count})`);
    } catch (error) {
      console.error('Honeypot mesaj dinleyici hatası:', error);
    }
  },
};
