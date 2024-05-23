-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS lodging CASCADE;
DROP TABLE IF EXISTS guests CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar TEXT
);

CREATE TABLE trips (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    location TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    users_id BIGINT REFERENCES users(id)
);

-- guests & users overlap and could be combined into just users
CREATE TABLE guests (
    guest_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    trips_id BIGINT REFERENCES trips(id)
);


CREATE TABLE flights (
    flight_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    airline TEXT NOT NULL,
    departure TEXT NOT NULL,
    arrival TEXT NOT NULL,
    flight_number TEXT,
    trips_id BIGINT REFERENCES trips(id)
);

CREATE TABLE lodging (
    lodging_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name_of_place TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    price_per_night MONEY NOT NULL,
    check_in TIMESTAMPTZ NOT NULL,
    check_out TIMESTAMPTZ NOT NULL,
    address_1 TEXT NOT NULL,
    address_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip BIGINT NOT NULL,
    trips_id BIGINT REFERENCES trips(id)

);

-- Will want to remove this seed data in production apps (or have it in a separate file)
INSERT INTO
users (username, email, avatar)
VALUES
('user.user', 'user.test@test.com', 'https://avatars.githubusercontent.com/u/87677895?v=4'),
('user.user2', 'user.test@test2.com', 'https://avatars.githubusercontent.com/u/68452618?v=4');

INSERT INTO
trips (location, start_date, end_date, users_id)
VALUES
('vegas', '4/29/2022', '5/12/2022', 1),
('italy', '6/19/2022', '7/20/2022', 2);

INSERT INTO
flights (airline, departure, arrival, flight_number, trips_id)
VALUES
('Alaska', '11:30', '4:00', 'bd234', 1),
('Spirit', '5:30', '1:00', 'cb234', 2);

INSERT INTO
guests (name, email, phone_number, emergency_contact, trips_id)
VALUES
('chad', 'chadsemail@chad.com', '111-111-1111', '713-555-5555', 1),
('tyler', 'tyler@email.com', '222-222-2222', '555-555-5555', 2);
