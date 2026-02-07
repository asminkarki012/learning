--Section 10 Views and Data manipulation
--181.challenge UPDATE
UPDATE film
SET
  rental_rate = 1.99
WHERE
  rental_rate = 0.99;

ALTER TABLE customer
ADD COLUMN initials VARCHAR(10);

UPDATE customer
SET
  initials = LEFT (first_name, 1) || '.' || LEFT (last_name, 1) || '.';

--187 challenge CREATE TABLE AS
CREATE TABLE customer_spendings AS
SELECT
  c.first_name || ' ' || c.last_name as name,
  SUM(amount) as total_amount
FROM
  payment p
  LEFT JOIN customer c ON p.customer_id = c.customer_id
GROUP BY
  "name";

--190 challenge CREATE VIEW
CREATE VIEW comedy_action_film_category AS
SELECT
  f.title,
  f.length,
  c.name
from
  film f
  LEFT JOIN category c ON c.name IN ('Action', 'Comedy')
  LEFT JOIN film_category fc ON fc.film_id = f.film_id
  AND c.category_id = fc.category_id
ORDER BY
  f.length DESC
