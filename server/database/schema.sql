create table user (
  id int unsigned primary key auto_increment not null,
  firstname varchar(100) not null,
  lastname varchar(100) not null,
  email varchar(255) not null unique,
  password varchar(255) not null
);

