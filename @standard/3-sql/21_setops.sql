SELECT name, 'student' AS role FROM students
UNION
SELECT name, 'teacher' AS role FROM teachers;

SELECT name, 'student' AS role FROM students
UNION ALL
SELECT name, 'teacher' AS role FROM teachers;


SELECT name FROM teachers
UNION ALL
SELECT name AS role FROM teachers;