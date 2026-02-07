--234 challenge : User-defined function
CREATE OR REPLACE FUNCTION fetch_total_payment(f_name TEXT, l_name TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS
$$
DECLARE
    total_payment NUMERIC;
BEGIN
    SELECT SUM(p.amount)
    INTO total_payment
    FROM payment p
    NATURAL JOIN customer c
    WHERE c.first_name = f_name AND c.last_name = l_name;
    RETURN total_payment;
END;
$$;


SELECT fetch_total_payment('AMY', 'LOPEZ');


-- 237 challenge : Transactions 
-- until commit is ran changes wont takes place
BEGIN;
UPDATE employees 
SET position_title = 'Head of BI',
salary = 14614.00
WHERE emp_id = 3;

UPDATE employees 
SET position_title = 'Head of Sales',
salary = 12587.00
WHERE emp_id = 2;
COMMIT;


--251 STORED PROCEDURE challenge
CREATE OR REPLACE PROCEDURE swap_employee_title(emp1 INT, emp2 INT)
LANGUAGE plpgsql
AS
$$
DECLARE
salary1 NUMERIC;
title1 TEXT;
salary2 NUMERIC;
title2 TEXT;
BEGIN
SELECT position_title,salary
INTO title1,salary1
FROM employees 
WHERE emp_id = emp1;

SELECT salary
INTO salary1
FROM employees 
WHERE emp_id = emp1;

SELECT position_title
INTO title2
FROM employees 
WHERE emp_id = emp2;

SELECT salary
INTO salary2
FROM employees 
WHERE emp_id = emp2;


UPDATE employees 
SET position_title = title2,
salary = salary2
WHERE emp_id = emp1;

UPDATE employees 
SET position_title = title1,
salary = salary1
WHERE emp_id = emp2;
COMMIT;
END;
$$;

CALL swap_employee_title(2,3);
