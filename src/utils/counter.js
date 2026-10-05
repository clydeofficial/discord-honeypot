const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const dataFile = path.join(dataDir, 'moderated.json');

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ count: 0 }, null, 2));
}

function getCount() {
  try {
    ensureFile();
    const raw = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return Number(raw.count) || 0;
  } catch {
    return 0;
  }
}

function setCount(n) {
  ensureFile();
  fs.writeFileSync(dataFile, JSON.stringify({ count: n }, null, 2));
  return n;
}

function increment() {
  return setCount(getCount() + 1);
}

module.exports = { getCount, setCount, increment };
