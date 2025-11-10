CREATE TABLE "users"(
    "user_id" bigserial PRIMARY KEY,
    "email" varchar NOT NULL,
    "phone" varchar NOT NULL,
    "password" varchar NOT NULL,
    "salt" varchar NOT NULL,
    "user_ype" varchar NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT(now())
)