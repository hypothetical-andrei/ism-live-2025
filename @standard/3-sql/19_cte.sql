WITH enrollment_details AS (
    SELECT 
        e.student_id,
        e.course_id,
        s.name AS student_name,
        c.name AS course_name
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN courses c ON e.course_id = c.id
)
SELECT * FROM enrollment_details;
