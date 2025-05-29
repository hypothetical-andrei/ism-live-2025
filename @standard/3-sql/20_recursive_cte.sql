CREATE TABLE student_mentorships (
    student_id INT,
    mentor_id INT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (mentor_id) REFERENCES students(id)
);

INSERT INTO student_mentorships (student_id, mentor_id) VALUES (1, 3);

INSERT INTO student_mentorships (student_id, mentor_id) VALUES (3, 2);

WITH RECURSIVE mentorship_chain AS (
    -- Base case: start with a specific student
    SELECT 
        s.id AS student_id,
        s.name AS student_name,
        CAST(NULL AS SIGNED) AS mentor_id,  -- Force NULL to match INT
        0 AS level
    FROM students s
    WHERE s.id = 1

    UNION ALL

    -- Recursive step: get mentor of the current student
    SELECT 
        m.mentor_id AS student_id,
        s.name,
        m.student_id,
        mc.level + 1
    FROM student_mentorships m
    JOIN students s ON m.mentor_id = s.id
    JOIN mentorship_chain mc ON m.student_id = mc.student_id
)
SELECT * FROM mentorship_chain;
