SELECT 
    d.name AS department_name,
    AVG(td.salary_per_hour) AS avg_salary_per_hour
FROM teacher_departments td
JOIN departments d ON td.department_id = d.id
GROUP BY d.name;
