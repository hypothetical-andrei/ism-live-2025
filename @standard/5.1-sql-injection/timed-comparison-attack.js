// timing_attack.js
const targetPassword = 'apple123';
const maxTries = 100; // how many times to repeat each guess for averaging
const delayPerMatch = 2; // ms of artificial delay per matching character

function vulnerableCompare(input, actual) {
  for (let i = 0; i < Math.min(input.length, actual.length); i++) {
    if (input[i] !== actual[i]) return false;
    const start = Date.now();
    while (Date.now() - start < delayPerMatch); // simulate delay per correct char
  }
  return input === actual;
}

function measureGuessTime(guess) {
  const start = Date.now();
  for (let i = 0; i < maxTries; i++) {
    vulnerableCompare(guess, targetPassword);
  }
  const end = Date.now();
  return (end - start) / maxTries;
}

async function runAttack() {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let guessed = '';

  console.log(`🔓 Starting timing attack...`);

  for (let pos = 0; pos < targetPassword.length; pos++) {
    let bestChar = null;
    let bestTime = 0;

    for (const char of charset) {
      const trial = guessed + char;
      const avgTime = measureGuessTime(trial);

      process.stdout.write(`\rPosition ${pos + 1}: trying '${char}' → ${avgTime.toFixed(2)}ms`);

      if (avgTime > bestTime) {
        bestTime = avgTime;
        bestChar = char;
      }
    }

    guessed += bestChar;
    console.log(`\n✅ Character ${pos + 1}: '${bestChar}' confirmed`);
  }

  console.log(`\n✔️ Guessed password: ${guessed}`);
}

runAttack();
