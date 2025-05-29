SELECT 
    teacher_id,
    salary_per_hour
FROM teacher_departments
WHERE salary_per_hour > (
    SELECT AVG(salary_per_hour)
    FROM teacher_departments
);
