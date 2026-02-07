--inner join challenge
SELECT
  s.fare_conditions as "Fare Conditions",
  COUNT(*) as "Count"
FROM
  boarding_passes bp
  INNER JOIN flights f ON f.flight_id = bp.flight_id
  INNER JOIN seats s ON s.aircraft_code = f.aircraft_code
  AND s.seat_no = bp.seat_no
GROUP BY
  "Fare Conditions"
ORDER BY
  "Count" DESC;

-- find ticket that dont boarding passes related to it
SELECT
  COUNT(*) AS "Ticket With No Boarding Passes"
FROM
  boarding_passes bp
  FULL OUTER JOIN tickets t ON bp.ticket_no = t.ticket_no
WHERE
  bp.ticket_no IS NULL;

--left join challenge 1
SELECT
  s.seat_no,
  COUNT(*) as "count"
FROM
  seats s
  LEFT JOIN boarding_passes bp ON bp.seat_no = s.seat_no
GROUP BY
  s.seat_no
ORDER BY
  "count" DESC;

--There have never been a seat no booked ? -> NO all seat are booked at least once checked by below query
SELECT
  *
FROM
  seats s
  LEFT JOIN boarding_passes bp ON bp.seat_no = s.seat_no
WHERE
  bp.seat_no IS NULL;

--left join challenge 2: most booked seat_line
SELECT
  RIGHT (s.seat_no, 1) as seat_line,
  COUNT(*) as "count"
FROM
  seats s
  LEFT JOIN boarding_passes bp ON bp.seat_no = s.seat_no
GROUP BY
  seat_line
ORDER BY
  "count" DESC;

-- challenge joins
--1st
SELECT
  c.first_name,
  c.last_name,
  a.phone
from
  customer c
  LEFT JOIN address a ON a.address_id = c.address_id
WHERE
  a.district = 'Texas';

--2nd  address that is not assigned to any customer
SELECT
  *
from
  address a
  LEFT JOIN customer c ON a.address_id = c.address_id
WHERE
  c.address_id IS NULL;

--multi join condition challenge
SELECT
  bp.seat_no,
  ROUND(AVG(tf.amount), 2)
FROM
  boarding_passes bp
  INNER JOIN ticket_flights tf ON tf.ticket_no = bp.ticket_no
  AND tf.flight_id = bp.flight_id
GROUP BY
  bp.seat_no
ORDER BY
  2 DESC;

--multi join table
SELECT
  c.first_name,
  c.last_name,
  c.email,
  co.country
from
  customer c
  INNER JOIN address a ON a.address_id = c.address_id
  INNER JOIN city ci ON ci.city_id = a.city_id
  INNER JOIN country co ON ci.country_id = co.country_id
WHERE
  co.country = 'Brazil';

--MORE CHALLENES
--challenge 1
SELECT
  passenger_name,
  SUM(total_amount)
FROM
  tickets t
  INNER JOIN bookings b ON t.book_ref = b.book_ref
GROUP BY
  passenger_name
ORDER BY
  SUM(total_amount) DESC;

--challenge 2
SELECT
  t.passenger_name,
  tf.fare_conditions,
  COUNT(*) as fare_conditions_count
FROM
  ticket_flights tf
  INNER JOIN tickets t ON t.ticket_no = tf.ticket_no
  AND t.passenger_name = 'ALEKSANDR IVANOV'
GROUP BY
  t.passenger_name,
  tf.fare_conditions
ORDER BY
  fare_conditions_count DESC;

--challenge 3
SELECT
  first_name,
  last_name,
  title,
  COUNT(*)
FROM
  customer cu
  INNER JOIN rental re ON cu.customer_id = re.customer_id
  INNER JOIN inventory inv ON inv.inventory_id = re.inventory_id
  INNER JOIN film fi ON fi.film_id = inv.film_id
WHERE
  first_name || ' ' || last_name = 'GEORGE LINTON'
GROUP BY
  title,
  first_name,
  last_name
ORDER BY
  4 DESC;
