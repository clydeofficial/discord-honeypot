const {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require('discord.js');

const MODERATED_COUNT_BUTTON_ID = 'moderated_count_button';

function buildHoneypotComponents(moderatedCount, { title, description, imageUrl, action } = {}) {
  const actionWord = action === 'ban' ? 'ban' : 'softban';
  const body = String(description).split('{action}').join(actionWord);
  const text = new TextDisplayBuilder().setContent(`${title}\n\n${body}`);
  const section = new SectionBuilder()
    .addTextDisplayComponents(text)
    .setThumbnailAccessory(new ThumbnailBuilder().setURL(imageUrl));
  const countButton = new ButtonBuilder()
    .setCustomId(MODERATED_COUNT_BUTTON_ID)
    .setStyle(ButtonStyle.Secondary)
    .setLabel(`Yakalanan: ${moderatedCount}`)
    .setEmoji('🍯');
  const row = new ActionRowBuilder().addComponents(countButton);
  const container = new ContainerBuilder().addSectionComponents(section).addActionRowComponents(row);
  return { components: [container], flags: MessageFlags.IsComponentsV2 };
}

module.exports = { buildHoneypotComponents, MODERATED_COUNT_BUTTON_ID };
