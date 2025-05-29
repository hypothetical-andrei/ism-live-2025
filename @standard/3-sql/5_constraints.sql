-- Alter the 'users' table to add a CHECK constraint that ensures 'username' is at least 3 characters long
ALTER TABLE users
ADD CONSTRAINT chk_username_length CHECK (CHAR_LENGTH(username) >= 3);

-- Try inserting a record with a username shorter than 3 characters to test the constraint
INSERT INTO users (username, type) VALUES ('ab', 'student');
