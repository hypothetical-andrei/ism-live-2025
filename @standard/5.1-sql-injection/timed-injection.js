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
  // we can perform the time test by supplying exactly: alice' AND IF(SUBSTRING(password,1,1) = 'a', SLEEP(5), 0) -- 

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test',
    multipleStatements: true
  });

  await setup(connection);

  const query = `SELECT * FROM users WHERE name = '${inputName}';`;
  console.log("Query:", query);

  const start = Date.now();
  try {
    await connection.query(query);
  } catch (e) {
    console.error("Query error:", e.message);
  }
  const end = Date.now();

  console.log(`⏱️ Query took ${end - start} ms`);
  await connection.end();
  rl.close();
});
