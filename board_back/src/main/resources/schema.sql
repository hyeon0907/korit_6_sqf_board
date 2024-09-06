DROP TABLE IF EXISTS USER;
DROP TABLE IF EXISTS ROLE;
DROP TABLE IF EXISTS USER_ROLES;
DROP TABLE IF EXISTS OAUTH2_USER;
DROP TABLE IF EXISTS BOARD;

CREATE TABLE USER (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE not null,
    password VARCHAR(255) not null,
    name VARCHAR(255) not null,
    email VARCHAR(255) NOT NULL,
    img TEXT not null default 'https://firebasestorage.googleapis.com/v0/b/userprofile-6905d.appspot.com/o/user%2Fdefault-user-icon.jpg?alt=media&token=f004f9ab-04f1-479e-a8b5-1ea975de0d7d'
);

CREATE TABLE ROLE (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE not null
);

INSERT INTO ROLE
VALUES (DEFAULT, 'ROLE_USER'),
       (DEFAULT, 'ROLE_MANAGER'),
       (DEFAULT, 'ROLE_ADMIN');

CREATE TABLE USER_ROLES (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT not null,
    role_id BIGINT not null
);

CREATE TABLE OAUTH2_USER(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT not null,
    oauth2_name VARCHAR(255) UNIQUE not null,
    provider VARCHAR(255) not null
);

CREATE TABLE BOARD(
    id BIGINT AUTO_INCREMENT PRIMARY KEY not null,
    title VARCHAR(255) not null,
    content LONGTEXT not null,
    user_id BIGINT not null
);