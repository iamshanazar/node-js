CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR (250) UNIQUE NOT NULL,
    password VARCHAR  NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    type VARCHAR (250)
);

CREATE TABLE faculties (
    id SERIAL PRIMARY KEY,
    name_tk VARCHAR,
    name_ru VARCHAR,
    name_en VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name_tk VARCHAR,
    name_ru VARCHAR,
    name_en VARCHAR,
    faculties_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR,
    lastname VARCHAR,
    department_id INTEGER,
    -- job: VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);