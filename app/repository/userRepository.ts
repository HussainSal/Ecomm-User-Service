import { UserModel } from "app/models/UserModel";
import { DBClient } from "app/utils/databaseClient";
import { ErrorResponse } from "app/utils/response";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository {
  constructor() {}

  async CreateAccount({ phone, email, password, salt, userType }: any) {
    console.log(
      "Created user DB operation",
      email,
      password,
      phone,
      userType,
      salt
    );

    // return {};
    try {
      const client = await DBClient();
      // establishing connection
      client.connect();

      const queryString =
        "INSERT INTO users(phone,email,password,salt,user_type) VALUES($1,$2,$3,$4,$5) RETURNING *";
      const values = [phone, email, password, salt, userType];
      const result = await client.query(queryString, values);

      // console.log(result, "result");
      // closing connection
      await client.end();

      if (result.rows.length > 0) {
        return result.rows[0] as UserModel;
      }
    } catch (err) {
      console.log(err, "Error");

      return ErrorResponse(500, err);
    }
  }

  async FindAccount(email: string) {
    try {
      const client = await DBClient();
      await client.connect();

      const queryString =
        "SELECT user_id,email,password,phone,salt FROM users where email = $1";
      const values = [email];

      const result = await client.query(queryString, values);
      await client.end();
      if (result.rowCount < 1) {
        throw new Error("User does not provide valied email");
      }
      // console.log(result.rows[0], "ROWSSSS");
      return result.rows[0] as UserModel;
    } catch (err) {
      console.log(err, "ERRR");
      return ErrorResponse(500, err);
    }
  }
}
