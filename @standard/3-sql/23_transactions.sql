-- Disable autocommit to start manual transaction control
SET autocommit = 0;

-- Start the transaction
START TRANSACTION;

-- Perform an update (e.g., update phone number for student with ID 1)
UPDATE students
SET phone = '555-0000'
WHERE id = 1;

-- Optionally check the result
SELECT id, name, phone FROM students WHERE id = 1;

-- Commit the transaction to make the update permanent
COMMIT;

-- Re-enable autocommit
SET autocommit = 1;
