SELECT 
    COUNT(*) / COUNT(DISTINCT student_id) AS avg_enrollments_per_student
FROM enrollments;
