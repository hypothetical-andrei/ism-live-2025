alter table users add constraint len_chk check (length(username) > 3);

insert into users (username, type) values ('a', 'STUDENT');