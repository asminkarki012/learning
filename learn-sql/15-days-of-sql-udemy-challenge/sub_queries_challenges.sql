-- 133.more challenges : subqueries in where 
-- challenge 1st
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  customer_id IN (
    SELECT
      customer_id
    FROM
      payment
    WHERE
      DATE(payment_date) = '2020-01-25'
  );

--challenge 2nd
SELECT
  first_name,
  email
FROM
  customer
WHERE
  customer_id IN (
    SELECT
      customer_id
    FROM
      payment
    GROUP BY
      customer_id
    HAVING
      SUM(amount) > 30
  );

--challenge 3rd
SELECT
  first_name,
  email
FROM
  customer
WHERE
  customer_id IN (
    SELECT
      customer_id
    FROM
      payment
    GROUP BY
      customer_id
    HAVING
      SUM(amount) > 100
  )
  AND address_id IN (
    SELECT
      address_id
    FROM
      address
    WHERE
      district = 'California'
  );

--136 challenge : subqueries from
SELECT
  ROUND(AVG(total_amount), 2) as avg_amount_spent_per_day
FROM
  (
    SELECT
      DATE(payment_date),
      SUM(amount) as total_amount
    FROM
      payment
    GROUP BY
      DATE(payment_date)
  ) as amount_spent_per_day;

--139 challenge : subqueries on select
SELECT
  *,
  (
    SELECT
      MAX(amount)
    from
      payment
  ) - amount as difference
FROM
  payment;

--141 corelated subqueries in where
SELECT
  *
FROM
  payment p1
WHERE
  amount = (
    SELECT
      MAX(amount)
    FROM
      payment p2
    WHERE
      p1.customer_id = p2.customer_id
  )
ORDER BY
  customer_id;

--142 challenge correlated subqueries in where
--challenge 1
SELECT
  title,
  film_id,
  replacement_cost,
  rating
FROM
  film f1
WHERE
  replacement_cost = (
    SELECT
      MIN(replacement_cost)
    FROM
      film f2
    WHERE
      f1.rating = f2.rating
  );

--challenge 2
SELECT
  title,
  film_id,
  "length",
  rating
FROM
  film f1
WHERE
  "length" = (
    SELECT
      MAX("length")
    FROM
      film f2
    WHERE
      f1.rating = f2.rating
  );

-- 144 correlated subquery in select
SELECT
  *,
  (
    SELECT
      MAX(amount)
    FROM
      payment p2
    WHERE
      p1.customer_id = p2.customer_id
  )
FROM
  payment p1
ORDER BY
  customer_id;

-- 145 challenge correlated subquery in select
--challenge 1
SELECT
  payment_id,
  customer_id,
  staff_id,
  amount,
  (
    SELECT
      SUM(amount)
    FROM
      payment p2
    WHERE
      p1.customer_id = p2.customer_id
  ) as "total_amount",
  (
    SELECT
      COUNT(*)
    FROM
      payment p3
    WHERE
      p1.customer_id = p3.customer_id
  ) as "count_payments"
FROM
  payment p1
ORDER BY
  customer_id;

-- challenge 2
SELECT
  title,
  rating,
  (
    SELECT
      AVG(replacement_cost)
    FROM
      film f3
    WHERE
      f1.rating = f3.rating
  ) as avg_replacement_cost_in_rating_category
FROM
  film f1
WHERE
  replacement_cost = (
    SELECT
      MAX(replacement_cost)
    FROM
      film f2
    WHERE
      f1.rating = f2.rating
  );

--challenge 3
SELECT
  cu.first_name,
  p.payment_id,
  p.amount
FROM
  customer cu
  INNER JOIN payment p ON p.customer_id = cu.customer_id
WHERE
  p.amount = (
    SELECT
      MAX(p1.amount)
    FROM
      payment p1
    WHERE
      p1.customer_id = cu.customer_id
  );
