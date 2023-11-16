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
