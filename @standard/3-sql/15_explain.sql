EXPLAIN
SELECT 
    s.name AS student_name,
    c.name AS course_name
FROM enrollments e
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id;
