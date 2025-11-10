import { Client } from "pg";

export const DBClient = async () => {
  return new Client({
    host: "127.0.0.1",
    user: "postgres",
    database: "user_service",
    password: "new_password",
    port: 5432,
  });
};
