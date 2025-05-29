SELECT 
    e.course_id,
    s.name AS student_name,
    ROW_NUMBER() OVER (PARTITION BY e.course_id ORDER BY e.id) AS enrollment_rank
FROM enrollments e
JOIN students s ON e.student_id = s.id;

SELECT 
    id,
    name,
    JSON_UNQUOTE(JSON_EXTRACT(grades, '$."1"')) AS course_1_grade,
    RANK() OVER (ORDER BY CAST(JSON_UNQUOTE(JSON_EXTRACT(grades, '$."1"')) AS UNSIGNED) DESC) AS rank_in_course_1
FROM students
WHERE JSON_EXTRACT(grades, '$."1"') IS NOT NULL;
