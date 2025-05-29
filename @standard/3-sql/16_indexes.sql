EXPLAIN
SELECT * FROM students
WHERE name = 'Alice';

ALTER TABLE students
ADD INDEX idx_student_name (name);

EXPLAIN
SELECT * FROM students
WHERE name = 'Alice';
