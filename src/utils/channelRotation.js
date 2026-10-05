const { CHANNEL_NAMES } = require('./channelNames');

function pickRandomName(current) {
  const pool = CHANNEL_NAMES.filter((name) => name !== current);
  const source = pool.length > 0 ? pool : CHANNEL_NAMES;
  return source[Math.floor(Math.random() * source.length)];
}

async function notifyLogChannel(client, content) {
  const logChannel = await client.channels.fetch(client.settings.logChannelId).catch(() => null);
  if (!logChannel || !logChannel.isSendable()) {
    return;
  }
  await logChannel.send({ content, allowedMentions: { parse: [] } }).catch(() => null);
}

async function rotateChannelName(client, channelId) {
  const targetId = channelId || client.settings.honeypotChannelId;
  const channel = await client.channels.fetch(targetId).catch(() => null);
  if (!channel || typeof channel.setName !== 'function') {
    return null;
  }
  const next = pickRandomName(channel.name);
  if (!next || next === channel.name) {
    return channel;
  }
  const oldName = channel.name;
  try {
    await channel.setName(next, 'Honeypot rastgele kanal ismi rotasyonu');
  } catch (error) {
    console.error(`Honeypot kanal ismi değiştirilemedi (#${oldName}):`, error.message ?? error);
    await notifyLogChannel(
      client,
      `⚠️ Honeypot kanalının (<#${targetId}>) ismi değiştirilemedi. Botun **Kanalları Yönet** iznini kontrol edin.`
    );
    return null;
  }
  console.log(`🍯 Honeypot kanal ismi değişti: #${oldName} -> #${next}`);
  return channel;
}

function startChannelRotation(client) {
  if (!client.settings.randomChannelName) {
    return null;
  }
  const intervalMs = client.settings.channelRenameIntervalMinutes * 60 * 1000;
  rotateChannelName(client).catch(() => null);
  return setInterval(() => {
    rotateChannelName(client).catch(() => null);
  }, intervalMs);
}

module.exports = { pickRandomName, rotateChannelName, startChannelRotation };
