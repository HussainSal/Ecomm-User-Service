import { UserModel } from "app/models/UserModel";
import { DBClient } from "app/utils/databaseClient";
import { ErrorResponse } from "app/utils/response";
import { injectable } from "tsyringe";
import { DBOperations } from "./dbOperations";

@injectable()
export class UserRepository extends DBOperations {
  constructor() {
    super();
  }

  async CreateAccount({ phone, email, password, salt, userType }: any) {
    console.log(
      "Created user DB operation",
      email,
      password,
      phone,
      userType,
      salt
    );

    try {
      console.log("LINE_24");

      const queryString =
        "INSERT INTO users(phone,email,password,salt,user_type) VALUES($1,$2,$3,$4,$5) RETURNING *";
      const values = [phone, email, password, salt, userType];

      const result = await this.executeQuery(queryString, values);

      console.log(result.rows[0], "LINE_30");
      if (result.rows.length > 0) {
        return result.rows[0] as UserModel;
      }
    } catch (err) {
      console.log("Error", err);
      return ErrorResponse(500, err);
    }
  }

  async FindAccount(email: string) {
    try {
      const queryString =
        "SELECT user_id,email,password,phone,salt, verification_code,expiry FROM users where email = $1";
      const values = [email];
      const result = await this.executeQuery(queryString, values);
      if (result.rowCount < 1) {
        throw new Error("User does not provide valied email");
      }
      return result.rows[0] as UserModel;
    } catch (err) {
      console.log(err, "ERRR");

      // return ErrorResponse(500, err);
    }
  }

  async updateVerificationCode(userId: number, expiry: Date, code: number) {
    const queryString =
      "UPDATE users SET verification_code=$1, expiry=$2 WHERE userId=$3 AND verified= FALSE RETURNING *";

    const values = [code, expiry, userId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async updateVerifyUser(userId: number) {
    // we will only verify it if it is false, if it already verified then no need for that
    const queryString =
      "UPDATE users SET verified=TRUE WHERE userId=$1 AND verified= FALSE RETURNING *";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }

    throw new Error("User already verified");
  }
}
