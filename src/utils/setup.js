const { buildHoneypotComponents } = require('./honeypotMessage');
const { getCount } = require('./counter');

async function ensureHoneypotMessage(client, channelId) {
  const settings = client.settings;
  const targetId = channelId || settings.honeypotChannelId;
  const channel = await client.channels.fetch(targetId).catch(() => null);
  if (!channel || !channel.isSendable()) {
    console.error(`Honeypot kanalı bulunamadı ya da yazılamıyor: ${targetId}`);
    return null;
  }
  const messages = await channel.messages.fetch({ limit: 20 }).catch(() => null);
  const existing = messages?.find(
    (m) => m.author?.id === client.user.id && m.flags?.has?.(32768)
  );
  if (existing) return existing;
  const count = getCount();
  const payload = buildHoneypotComponents(count, {
    title: settings.honeypotTitle,
    description: settings.honeypotDescription,
    imageUrl: settings.honeypotImageUrl,
    action: settings.action,
  });
  return channel.send(payload);
}

async function refreshHoneypotCounter(client, channelId) {
  const settings = client.settings;
  const targetId = channelId || settings.honeypotChannelId;
  const channel = await client.channels.fetch(targetId).catch(() => null);
  if (!channel || !channel.isSendable()) return;
  const messages = await channel.messages.fetch({ limit: 20 }).catch(() => null);
  const existing = messages?.find((m) => m.author?.id === client.user.id);
  if (!existing) return;
  const payload = buildHoneypotComponents(getCount(), {
    title: settings.honeypotTitle,
    description: settings.honeypotDescription,
    imageUrl: settings.honeypotImageUrl,
    action: settings.action,
  });
  await existing.edit(payload).catch(() => null);
}

module.exports = { ensureHoneypotMessage, refreshHoneypotCounter };
