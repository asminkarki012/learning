--challenge 213: GROUPING SET
SELECT
  c.first_name,
  c.last_name,
  p.staff_id,
  SUM(p.amount) as total
FROM
  payment p
  LEFT JOIN customer c ON c.customer_id = p.customer_id
GROUP BY
  GROUPING SETS (
    (c.first_name, c.last_name),
    (first_name, last_name, staff_id)
  );

--challenge 218 ROLL UP
SELECT
  EXTRACT(
    quarter
    FROM
      book_date
  ) AS quarter,
  EXTRACT(
    month
    FROM
      book_date
  ) AS month,
  TO_CHAR (book_date, 'w') AS week_in_year,
  DATE(book_date),
  SUM(total_amount) AS total_amount
FROM
  bookings
GROUP BY
  ROLLUP (quarter, month, week_in_year, DATE(book_date))
ORDER BY
  1,
  2,
  3
  -- challenge 221 CUBE
SELECT
  p.customer_id,
  f.title,
  SUM(p.amount) as total
FROM
  payment p
  LEFT JOIN rental r ON r.rental_id = p.rental_id
  LEFT JOIN inventory inv ON inv.inventory_id = r.inventory_id
  LEFT JOIN film f ON f.film_id = inv.film_id
GROUP BY
  CUBE (p.customer_id, f.title)
ORDER BY
  1,
  2,
  3
  -- challenge 225 SELF JOIN
SELECT
  f1.title,
  f2.title,
  f1.length
FROM
  film f1
  LEFT JOIN film f2 ON f1.length = f2.length
  AND f1.title != f2.title
ORDER BY
  3 DESC;
