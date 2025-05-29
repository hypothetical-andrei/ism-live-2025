-- non valid, pk violation
insert into users (id, username, type) values (1, 'pk constraint violation', 'STUDENT');
-- valid
insert into users (id, username, type) values (5, 'valid student', 'STUDENT');
