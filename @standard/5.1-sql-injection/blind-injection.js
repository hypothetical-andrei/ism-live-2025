import mysql from 'mysql2/promise';
import readline from 'readline';

async function setup(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      password VARCHAR(255)
    )
  `);

  const [rows] = await connection.execute(`SELECT COUNT(*) AS count FROM users`);
  if (rows[0].count === 0) {
    await connection.execute(`INSERT INTO users (name, password) VALUES ('alice', 'apple123'), ('bob', 'banana456')`);
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Enter username: ", async (inputName) => {
  // we can perform sql injection by supplying exactly: alice' AND SUBSTRING(password,1,1) = 'a' -- 


  const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'root', database: 'test' });

  await setup(connection);

  const query = `SELECT * FROM users WHERE name = '${inputName}'`;
  console.log("Query:", query);

  const [rows] = await connection.execute(query);
  console.log(rows.length > 0 ? "✅ User exists" : "❌ Not found");

  await connection.end();
  rl.close();
});
