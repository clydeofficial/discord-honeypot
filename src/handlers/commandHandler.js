const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '..', 'commands');

function walk(dir, category, client) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, entry.name, client);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const command = require(full);
      command.category = category;
      client.commands.set(command.data.name, command);
    }
  }
}

module.exports = {
  async loadCommands(client) {
    if (!fs.existsSync(commandsDir)) return client.commands;
    walk(commandsDir, '', client);
    return client.commands;
  },
};
