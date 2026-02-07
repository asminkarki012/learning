--run one at a time
--1st challenge Solution
SELECT
  EXTRACT(
    month
    from
      payment_date
  ) as "month",
  SUM(amount) as total_payment_amount
FROM
  payment
GROUP BY
  "month"
ORDER BY
  total_payment_amount DESC;

--2nd challenge solution
SELECT
  EXTRACT(
    DOW
    from
      payment_date
  ) as "day_of_week",
  SUM(amount) as total_payment_amount
FROM
  payment
GROUP BY
  day_of_week
ORDER BY
  total_payment_amount DESC;

--3rd challenge solution
SELECT
  EXTRACT(
    WEEK
    from
      payment_date
  ) as "week",
  customer_id,
  SUM(amount) as total_payment_amount
FROM
  payment
GROUP BY
  "week",
  customer_id
ORDER BY
  total_payment_amount DESC;
