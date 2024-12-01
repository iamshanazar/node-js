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
    job VARCHAR,
    sirname VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    name_tk VARCHAR,
    name_ru VARCHAR,
    name_en VARCHAR,
    file VARCHAR,
    file_type VARCHAR,
    file_size VARCHAR,
    file_name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE zurnal (
    id SERIAL PRIMARY KEY,
    name_tk VARCHAR,
    name_ru VARCHAR,
    name_en VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    name_tk VARCHAR,
    name_ru VARCHAR,
    name_en VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    zurnal_id INT NOT NULL,
    teacher_id INT, 
    type VARCHAR,
    constraint articles_zurnal_id_fk
      foreign key("zurnal_id")
        references zurnal("id")
         on update cascade on delete cascade,

    constraint articles_teacher_id_fk
      foreign key("teacher_id")
        references  teachers("id")
         on update cascade on delete cascade,
    UNIQUE ("zurnal_id", "name_tk")
);

CREATE INDEX articles_zurnal_id_index on articles ('zurnal_id');

