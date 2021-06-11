
CREATE DATABASE keystone;

CREATE USER 'keystone'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%';

