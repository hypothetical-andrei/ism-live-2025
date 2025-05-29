CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE teacher_departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    department_id INT NOT NULL,
    salary_per_hour DECIMAL(10, 2) NOT NULL,
    hours INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

INSERT INTO departments (name) VALUES
('Mathematics'),
('Physics'),
('Computer Science');

-- Assuming teacher IDs 1 and 2 exist from earlier inserts
INSERT INTO teacher_departments (teacher_id, department_id, salary_per_hour, hours) VALUES
(1, 1, 50.00, 20),  -- Teacher 1 to Mathematics
(2, 2, 55.00, 15),  -- Teacher 2 to Physics
(2, 3, 60.00, 10);  -- Teacher 2 also to Computer Science
