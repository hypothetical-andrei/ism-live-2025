CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Unique identifier for each user
    name VARCHAR(100) NOT NULL,             -- Full name of the user
    type ENUM('student', 'teacher') NOT NULL -- Role of the user, either student or teacher
) COMMENT='Stores all users, either students or teachers';
