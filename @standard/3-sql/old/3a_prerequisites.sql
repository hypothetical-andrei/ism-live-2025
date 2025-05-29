/*
user(id, name, type)

student(id, name, email, phone, user_id)
teacher(id, name, email, phone, user_id)

course(id, name, description, max_activities)

course_edition(id, description, start_date, course_id)

student_enrollment(id, student_id, course_edition_id)

teacher_enrollment(id, teacher_id, course_edition_id)

location(id, description)

time_slot(id, start_time, end_time, location_id)

activity(id, description, course_edition_id, time_slot_id)
*/

create table students (
  id int not null auto_increment primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(255) not null,
  user_id int not null,
  index user_index (user_id),
  foreign key(user_id) references users(id)
  on delete cascade
  on update cascade
)
engine InnoDB;

create table teachers (
  id int not null auto_increment primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(255) not null,
  user_id int not null,
  index user_index (user_id),
  foreign key(user_id) references users(id)
  on delete cascade
  on update cascade
)
engine InnoDB;

create table courses (
  id int not null auto_increment primary key,
  name varchar(255) not null,
  description text,
  max_activities int not null
)
engine InnoDB;

create table course_editions (
  id int not null auto_increment primary key,
  description varchar(255) not null,
  start_date date,
  course_id int not null,
  index course_index (course_id),
  foreign key(course_id) references courses(id)
  on delete cascade
  on update cascade
)
engine InnoDB;

create table student_enrollements (
  id int not null auto_increment primary key,
  course_edition_id int not null,
  student_id int not null,
  index course_edition_index (course_edition_id),
  foreign key(course_edition_id) references course_editions(id)
  on delete cascade
  on update cascade,
  index student_index (student_id),
  foreign key(student_id) references students(id)
  on delete cascade
  on update cascade
)
engine InnoDB;

create table teacher_enrollements (
  id int not null auto_increment primary key,
  course_edition_id int not null,
  teacher_id int not null,
  index course_edition_index (course_edition_id),
  foreign key(course_edition_id) references course_editions(id)
  on delete cascade
  on update cascade,
  index teacher_index (teacher_id),
  foreign key(teacher_id) references teachers(id)
  on delete cascade
  on update cascade
)
engine InnoDB;

create table locations (
  id int not null auto_increment primary key,
  description varchar(255) not null
)
engine InnoDB;

create table time_slots (
  id int not null auto_increment primary key,
  start_time datetime not null,
  end_time datetime not null,
  location_id int not null,
  foreign key(location_id) references locations(id)
  on delete cascade
  on update cascade
)
engine InnoDB;

create table activity (
  id int not null auto_increment primary key,
  description varchar(255) not null,
  course_edition_id int not null,
  time_slot_id int not null,
  foreign key(course_edition_id) references course_editions(id)
  on delete cascade
  on update cascade,
  foreign key(time_slot_id) references time_slots(id)
  on delete cascade
  on update cascade
)
engine InnoDB;
