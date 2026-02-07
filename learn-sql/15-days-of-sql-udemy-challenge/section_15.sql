--248 challenge : Privileges
-- create new user
CREATE USER mia
WITH
  PASSWORD 'mia123';

--create new role
CREATE ROLE analyst_emp;

--grant viewing access of public table
GRANT USAGE ON SCHEMA public TO analyst_emp;

--grant select
GRANT
SELECT
  ON ALL TABLES IN SCHEMA public TO analyst_emp;

-- grant insert update on employee table
GRANT INSERT,
UPDATE ON employees TO analyst_emp;

--grant creating new db
ALTER ROLE analyst_emp CREATEDB;

-- assign role to a user
GRANT analyst_emp to mia;
