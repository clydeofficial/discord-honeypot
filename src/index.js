require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');

function required(name) {
  const value = process.env[name];
  if (value === undefined || String(value).trim() === '') {
    throw new Error(`Zorunlu env değişkeni eksik: ${name} (.env.example dosyasına bak)`);
  }
  return String(value).trim();
}

const action = String(process.env.ACTION || 'softban').trim().toLowerCase();
if (action !== 'softban' && action !== 'ban') {
  throw new Error(`ACTION "softban" ya da "ban" olmalı, gelen: ${action}`);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.settings = {
  token: required('TOKEN'),
  honeypotChannelId: required('HONEYPOT_CHANNEL_ID'),
  logChannelId: required('LOG_CHANNEL_ID'),
  action,
  randomChannelName: String(process.env.RANDOM_CHANNEL_NAME || 'false').trim().toLowerCase() === 'true',
  deleteMessageSeconds: 3600,
  channelRenameIntervalMinutes: 1440,
  honeypotImageUrl: 'https://honeypot.riskymh.dev/honeypot.png',
  honeypotTitle: '## BU KANALA MESAJ GÖNDERMEYİN',
  honeypotDescription: 'Bu kanal spam botlarını yakalamak için tuzak olarak kullanılır. Buraya mesaj gönderen herkes **{action}** cezası alır.',
};

process.on('unhandledRejection', (reason) => {
  console.error('Yakalanamayan promise hatası:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Yakalanamayan hata:', error);
});

(async () => {
  await loadCommands(client);
  await loadEvents(client);
  await client.login(client.settings.token);
})();
