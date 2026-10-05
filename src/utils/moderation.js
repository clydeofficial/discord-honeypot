async function applyHoneypotAction({ guild, userId, action, deleteMessageSeconds, reason }) {
  if (action === 'ban') {
    await guild.members.ban(userId, { deleteMessageSeconds, reason });
    return 'banned';
  }
  await guild.members.ban(userId, { deleteMessageSeconds, reason });
  await guild.members.unban(userId, `Softban (tekrar katılabilir): ${reason}`);
  return 'softbanned';
}

module.exports = { applyHoneypotAction };
