import mysql from 'mysql2/promise';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Enter username: ", async (inputName) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
  });

  // Ensure table and data
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

  // Use prepared statement
  const [results] = await connection.execute(
    'SELECT * FROM users WHERE name = ?',
    [inputName]
  );

  console.log(results.length > 0 ? "✅ User exists" : "❌ Not found");
  await connection.end();
  rl.close();
});
