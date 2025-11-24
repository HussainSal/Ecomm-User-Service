import { LoginInput } from "app/models/dto/LoginInput";
import { SignupInput } from "app/models/dto/SignupInput";
import { VerificationInput } from "app/models/dto/UpdatedInput";
import { UserRepository } from "app/repository/userRepository";
import { timeDifference } from "app/utils/dateHelper";
import { AppValidationError } from "app/utils/errors";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "app/utils/notification";
import {
  GenSalt,
  GetHashedPassword,
  GetToken,
  ValidatePassword,
  VerifyToken,
} from "app/utils/password";
import { ErrorResponse, SuccessResponse } from "app/utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { log } from "console";
import { autoInjectable, inject, injectable } from "tsyringe";

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private repository: UserRepository) {}

  // User creation & login functions
  async CreateUser(event: APIGatewayProxyEventV2) {
    const input = plainToClass(SignupInput, event.body);
    const errors = await AppValidationError(input);

    if (errors) {
      return ErrorResponse(404, errors);
    }
    console.log("Signup", event.body);

    const salt = await GenSalt();
    const hashedPassword = await GetHashedPassword(input.password, salt);

    await this.repository.CreateAccount({
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      userType: "BUYER",
      salt: salt,
    });
    return SuccessResponse({ message: "response from create user." });
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const errors = await AppValidationError(input);

      if (errors) {
        return ErrorResponse(404, errors);
      }

      const data: any = await this.repository.FindAccount(input.email);
      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );

      console.log(verified, "verified");

      if (!verified) {
        throw new Error("Password does not match");
      }
      const token = GetToken(data);
      return SuccessResponse({ token });
    } catch (err) {
      console.log(err, "login err");
      return ErrorResponse(500, err);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    console.log("Signup");
    const token = event.headers.authorization;
    const payload = await VerifyToken(token);

    if (!payload.ok) return ErrorResponse(403, "Authorization failed.");

    if (payload) {
      const { code, expiry } = GenerateAccessCode();

      await this.repository.updateVerificationCode(
        payload.user.user_id,
        expiry,
        code
      );

      console.log(code, expiry);
      // const response = await SendVerificationCode(code, payload.phone);

      return SuccessResponse({
        message: "Verification code send successfully",
      });
    }

    // return SuccessResponse({ message: "response from verify user." });
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    console.log("Signup");
    const token = event.headers.authorization;
    const payload = await VerifyToken(token);

    const input = plainToClass(VerificationInput, event.body);
    const errors = await AppValidationError(input);

    if (errors) {
      return ErrorResponse(404, errors);
    }

    if (payload.ok) {
      const { verification_code, expiry } = await this.repository.FindAccount(
        payload.user.email
      );

      if (verification_code === parseInt(input.code)) {
        const currentTime = new Date();
        const diff = timeDifference(expiry, currentTime.toISOString(), "m");

        if (diff < 0) {
          ErrorResponse(403, "Cdode expired");
        } else {
          this.repository.updateVerifyUser(payload.user.user_id);
          console.log("Verified Successfully ");
        }

        console.log(diff, "LINE_127");
      }

      console.log(verification_code, "VALUES_HERE", expiry);

      return SuccessResponse({ message: "response from verify user." });
    }
  }

  // User profile

  async CreateProfile(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  async EditProfile(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  // Cart Section

  async CreateCart(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  // Payment section

  async CreatePaymetMethod(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  async GetPaymetMethod(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }

  async UpdatePaymetMethod(event: APIGatewayProxyEventV2) {
    console.log("Signup");

    return SuccessResponse({ message: "response from verify user." });
  }
}
