use odin;

create table users (
  id int not null auto_increment primary key,
  name varchar(255) not null,
  type enum('STUDENT', 'TEACHER')
)
engine InnoDB;