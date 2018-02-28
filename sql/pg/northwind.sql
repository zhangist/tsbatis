-- ------------------------------------------------------
-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-- Step 1: Execute the following commands

-- ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
-- CREATE USER travis WITH LOGIN PASSWORD 'travis';
-- CREATE DATABASE northwind;
-- GRANT ALL PRIVILEGES ON DATABASE northwind TO travis;
-- ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-- Step 2: Connect to database northwind and open query
-- tool to execute the following commands
-- ------------------------------------------------------

-- Dumping structure for table northwind.customer
CREATE TABLE customer
(
  id character varying(50) NOT NULL,
  company_name character varying(100) DEFAULT 0,
  contract_name character varying(100) DEFAULT 0,
  contract_title character varying(100) DEFAULT 0,
  address character varying(100) DEFAULT 0,
  city character varying(100) DEFAULT 0,
  region character varying(100) DEFAULT 0,
  postal_code character varying(100) DEFAULT 0,
  country character varying(100) DEFAULT 0,
  phone character varying(100) DEFAULT 0,
  fax character varying(100) DEFAULT 0,
  PRIMARY KEY (id)
)
WITH (
  OIDS = FALSE
);
ALTER TABLE customer OWNER to travis;

-- Dumping data for table northwind.customer: ~2 rows (approximately)
INSERT INTO customer (id, company_name, contract_name, contract_title, address, city, region, postal_code, country, phone, fax) VALUES
	('ALFKI', 'Alfreds Futterkiste', 'Maria Anders', 'Sales Representative', 'Obere Str. 57', 'Berlin', 'Western Europe', '12209', 'Germany', '030-0074321', '030-0076545'),
	('ANATR', 'Ana Trujillo Emparedados y helados', 'Ana Trujillo', 'Owner', 'Avda. de la Constitución 2222', 'México D.F.', 'Central America', '05021', 'Mexico', '(5) 555-4729', '(5) 555-3745');

-- Dumping structure for table northwind.student
CREATE TABLE student
(
  name character varying(255) NOT NULL,
  age integer NOT NULL
)
WITH (
  OIDS = FALSE
);
ALTER TABLE student OWNER to travis;

-- Dumping structure for table northwind.student
CREATE TABLE book (
	id serial NOT NULL,
	name character varying(100) DEFAULT 0,
	price numeric(10,0) NULL DEFAULT 10,
	PRIMARY KEY (id)
)
WITH (
  OIDS = FALSE
);
ALTER TABLE book OWNER to travis;
