DROP TABLE IF EXISTS activities CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS habits CASCADE;

DROP TABLE IF EXISTS habits_journal CASCADE;

DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE activities (
  id serial PRIMARY KEY NOT NULL,
  name varchar(255) NOT NULL,
  image varchar(255),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  active boolean DEFAULT TRUE
);

CREATE TABLE users (
  id serial PRIMARY KEY NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  PASSWORD VARCHAR(255) NOT NULL,
  renew_date date,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  active boolean DEFAULT TRUE
);

CREATE TABLE habits (
  id serial PRIMARY KEY NOT NULL,
  user_id integer REFERENCES users (id) ON DELETE CASCADE,
  activity_id integer REFERENCES activities (id) ON DELETE CASCADE,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  frequency int,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  active boolean DEFAULT TRUE
);

CREATE TABLE habits_journal (
  id serial PRIMARY KEY NOT NULL,
  habit_id integer REFERENCES habits (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  active boolean DEFAULT TRUE
);

CREATE TABLE notifications (
  id serial PRIMARY KEY NOT NULL,
  habit_id integer REFERENCES habits (id) ON DELETE CASCADE,
  notification_type varchar(255),
  scheduled_time timestamptz,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  completed boolean DEFAULT FALSE
);

