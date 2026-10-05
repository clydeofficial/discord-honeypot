const { time, TimestampStyles } = require('discord.js');

async function sendHoneypotLog({ client, logChannelId, honeypotChannelId, guild, user, member, actionText }) {
  const logChannel = await client.channels.fetch(logChannelId).catch(() => null);
  if (!logChannel || !logChannel.isSendable()) {
    console.error(`Log kanalı bulunamadı ya da yazılamıyor: ${logChannelId}`);
    return;
  }
  const created = time(user.createdAt, TimestampStyles.RelativeTime);
  const joined = member?.joinedAt ? time(member.joinedAt, TimestampStyles.RelativeTime) : '`bilinmiyor`';
  await logChannel.send({
    content:
      `${user} honeypot tuzağına düştüğü için **${actionText}** (<#${honeypotChannelId}>)\n` +
      `-# Kullanıcı ID: \`${user.id}\` • Hesap Oluşturulma: ${created} • Sunucuya Katılma: ${joined}`,
    allowedMentions: { parse: [] },
  });
}

module.exports = { sendHoneypotLog };
