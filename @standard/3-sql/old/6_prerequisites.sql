INSERT INTO users (username, type) VALUES ("JohnDoe", "STUDENT");
INSERT INTO users (username, type) VALUES ("JaneDoe", "TEACHER");
INSERT INTO users (username, type) VALUES ("AwesomeAdmin", NULL);

INSERT INTO students (name, email, phone, user_id) VALUES ("Alice Smith", "alice.smith@email.com", "123-456-7890", 1);
INSERT INTO students (name, email, phone, user_id) VALUES ("Bob Johnson", "bob.johnson@email.com", "987-654-3210", 2);

INSERT INTO teachers (name, email, phone, user_id) VALUES ("Ms. Anderson", "anderson@school.edu", "555-555-5555", 3);

INSERT INTO courses (name, description, max_activities) VALUES ("Software Engineering", "Introduction to software development principles", 10);
INSERT INTO courses (name, description, max_activities) VALUES ("Creative Writing", "Explore different writing styles and techniques", 5);

INSERT INTO course_editions (description, start_date, course_id) VALUES ("Fall Semester 2024", "2024-09-01", 1);
INSERT INTO course_editions (description, start_date, course_id) VALUES ("Spring Semester 2025", "2025-01-15", 2);

INSERT INTO student_enrollements (course_edition_id, student_id) VALUES (1, 1);
INSERT INTO student_enrollements (course_edition_id, student_id) VALUES (2, 2);

INSERT INTO teacher_enrollements (course_edition_id, teacher_id) VALUES (1, 3);
INSERT INTO teacher_enrollements (course_edition_id, teacher_id) VALUES (2, 3);

INSERT INTO locations (description) VALUES ("Lecture Hall 1");
INSERT INTO locations (description) VALUES ("Online Meeting Room");

INSERT INTO time_slots (start_time, end_time, location_id) VALUES ("2024-10-24 10:00:00", "2024-10-24 12:00:00", 1);
INSERT INTO time_slots (start_time, end_time, location_id) VALUES ("2025-02-12 14:00:00", "2025-02-12 16:00:00", 2);

INSERT INTO activity (description, course_edition_id, time_slot_id) VALUES ("Midterm Exam", 1, 1);
INSERT INTO activity (description, course_edition_id, time_slot_id) VALUES ("Group Project Presentation", 2, 2);