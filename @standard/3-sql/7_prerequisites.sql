-- Assume the users table already has these entries:
-- ('alice123', 'student'), ('bob_teacher', 'teacher'), ('charlie01', 'student'), ('diana_teach', 'teacher'), ('eve_student', 'student')

-- Insert into student (assuming IDs match inserted users)
INSERT INTO students (name, email, phone, user_id) VALUES
('Alice', 'alice@example.com', '1234567890', 1),
('Charlie', 'charlie@example.com', '1234567891', 3),
('Eve', 'eve@example.com', '1234567892', 5);

-- Insert into teacher
INSERT INTO teachers (name, email, phone, user_id) VALUES
('Bob', 'bob@example.com', '9876543210', 2),
('Diana', 'diana@example.com', '9876543211', 4);

-- Insert into course
INSERT INTO courses (name, description, max_activities) VALUES
('Mathematics', 'An introductory course in algebra and calculus', 5),
('Physics', 'Basics of mechanics and thermodynamics', 6);

-- Insert into course_edition
INSERT INTO course_editions (description, start_date, course_id) VALUES
('Fall 2025 edition', '2025-09-01', 1),
('Spring 2026 edition', '2026-02-15', 2);

-- Insert into enrollment (students into courses)
INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1),
(2, 2),
(3, 1);

-- Insert into location
INSERT INTO locations (description) VALUES
('Room A101'),
('Room B202');

-- Insert into time_slot
INSERT INTO time_slots (start_time, end_time, location_id) VALUES
('2025-09-03 10:00:00', '2025-09-03 11:00:00', 1),
('2025-09-04 14:00:00', '2025-09-04 15:30:00', 2);

-- Insert into activity
INSERT INTO activities (description, course_edition_id, time_slot_id) VALUES
('Lecture: Introduction to Algebra', 1, 1),
('Lab: Mechanics Experiment 1', 2, 2);
