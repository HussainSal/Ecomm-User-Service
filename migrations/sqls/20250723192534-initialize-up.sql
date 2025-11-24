CREATE TABLE "users"(
    "user_id" bigserial PRIMARY KEY,
    "email" varchar NOT NULL,
    "phone" varchar NOT NULL,
    "password" varchar NOT NULL,
    "salt" varchar NOT NULL,
    "user_type" varchar NOT NULL,
    "first_name" varchar,
    "last_name" varchar,
    "profile_pic" text,
    "verification_code" integer,
    "expiry" timestamptz,
    "verified" boolean NOT NULL DEFAULT FALSE,
    "created_at" timestamptz NOT NULL DEFAULT(now())
)

CREATE TABLE "users_addresses"(
    "id" bigserial PRIMARY KEY,
    "user_id" BIGINT REFERENCES users(user_id),
    "address_1" varchar NOT NULL,
    "address_2" varchar NOT NULL,
    "city" varchar(200),
    "postal_code" char(10),
    "country" varchar(200)
)

-- CREATE TABLE users_addresses (
--     id BIGSERIAL PRIMARY KEY,
--     user_id BIGINT REFERENCES users(id),
--     address_1 VARCHAR(200) NOT NULL,
--     address_2 VARCHAR(200) NOT NULL,
--     city VARCHAR(200),
--     postal_code CHAR(10),
--     country VARCHAR(200)
-- );

