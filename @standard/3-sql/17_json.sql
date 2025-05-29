ALTER TABLE students
ADD COLUMN grades JSON;

UPDATE students
SET grades = JSON_OBJECT('1', 85, '2', 90)
WHERE id = 1;

UPDATE students
SET grades = JSON_OBJECT('1', 78)
WHERE id = 3;

UPDATE students
SET grades = JSON_OBJECT('2', 88)
WHERE id = 5;

SELECT 
    AVG(CAST(JSON_UNQUOTE(JSON_EXTRACT(grades, '$."1"')) AS UNSIGNED)) AS avg_grade_course_1
FROM students
WHERE JSON_EXTRACT(grades, '$."1"') IS NOT NULL;
