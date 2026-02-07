--Section 9 Managing Tables and databases
--173 challenge 
--create table first
CREATE TABLE director (
  director_id SERIAL PRIMARY KEY,
  director_account_name VARCHAR(20) UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50) DEFAULT 'Not specified',
  date_of_birth DATE,
  address_id INT REFERENCES address (address_id)
);

-- alter table
ALTER TABLE director
ALTER COLUMN account_name TYPE VARCHAR(30),
ALTER COLUMN last_name
DROP DEFAULT,
ALTER COLUMN last_name
SET
  NOT NULL,
ALTER COLUMN first_name TYPE TEXT,
ADD COLUMN email VARCHAR(40);

ALTER TABLE director
RENAME COLUMN director_account_name TO account_name,
ALTER TABLE director
RENAME TO directors;

--177 challenge
CREATE TABLE songs (
  song_id SERIAL PRIMARY KEY,
  song_name VARCHAR(30) NOT NULL,
  genre VARCHAR(30) DEFAULT 'Not Defined',
  price NUMERIC(4, 2) CONSTRAINT price_check CHECK (price > 1.99),
  release_date DATE CONSTRAINT date_check CHECK (
    release_date BETWEEN '01-01-1950' AND CURRENT_DATE
  )
);

--get error price_check error on price run alter below then run this
INSERT INTO
  songs (song_id, song_name, price, release_date)
VALUES
  (4, 'SQL song', 0.99, '2022-01-07');

ALTER TABLE songs
DROP CONSTRAINT price_check,
ADD CONSTRAINT price_check CHECK (price >= 0.99);
