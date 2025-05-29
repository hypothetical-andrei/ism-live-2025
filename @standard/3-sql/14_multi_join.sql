SELECT 
    a.description AS activity_description,
    c.name AS course_name,
    l.description AS location_description
FROM activities a
JOIN course_editions ce ON a.course_edition_id = ce.id
JOIN courses c ON ce.course_id = c.id
JOIN time_slots ts ON a.time_slot_id = ts.id
JOIN locations l ON ts.location_id = l.id;


SELECT 
    s.name AS student_name,
    c.name AS course_name,
    ce.description AS course_edition_description,
    ts.start_time AS activity_start_time
FROM enrollments e
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id
JOIN course_editions ce ON ce.course_id = c.id
JOIN activities a ON a.course_edition_id = ce.id
JOIN time_slots ts ON a.time_slot_id = ts.id;
