SELECT 
    department_id,
    AVG(salary_per_hour) AS avg_salary_per_hour
FROM teacher_departments
GROUP BY department_id;


SELECT 
    department_id,
    AVG(salary_per_hour) AS avg_salary_per_hour
FROM teacher_departments
GROUP BY department_id
HAVING AVG(salary_per_hour) > 55;
