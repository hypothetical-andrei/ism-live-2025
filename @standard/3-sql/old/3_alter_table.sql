alter table users drop column name;

alter table users add column username varchar(255) not null after id;

describe users;