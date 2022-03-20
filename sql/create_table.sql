CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR (250) NOT NULL,
    lastname VARCHAR (250) NOT NULL,
    email VARCHAR (250) NOT NULL,
    password VARCHAR (72) NOT NULL,
    created TIME DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    user_id INT references users(id),
    day INT NOT NULL,
    start_time TIME DEFAULT now(),
    end_time TIME
);