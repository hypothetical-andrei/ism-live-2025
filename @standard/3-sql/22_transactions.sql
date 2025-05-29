-- Disable autocommit to manually control the transaction
SET autocommit = 0;

-- Start the transaction (optional in MySQL when autocommit is off)
START TRANSACTION;

-- Perform a DELETE (example: delete a student by name)
DELETE FROM students WHERE name = 'tim';

-- Verify the effect (optional)
SELECT * FROM students WHERE name = 'tim';

-- Rollback the transaction to undo the DELETE
ROLLBACK;

-- Confirm rollback (should show the student again)
SELECT * FROM students WHERE name = 'tim';

-- Re-enable autocommit
SET autocommit = 1;
