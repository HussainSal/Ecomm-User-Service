import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "app/services/userService";
import { ErrorResponse } from "app/utils/response";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { container } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "app/models/dto/SignupInput";
import { AppValidationError } from "app/utils/errors";

const userService = container.resolve(UserService);

export const Signup = middy(async (event: APIGatewayProxyEventV2) => {
  // converting event.body to Signup instance

  // const body = event.body;
  // console.log(body, "BODY");
  return userService.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return userService.UserLogin(event);
}).use(bodyParser());

export const Verify = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod == "post") {
    return userService.VerifyUser(event);
  } else if (httpMethod == "get") {
    return userService.GetVerificationToken(event);
  } else {
    return ErrorResponse(404, "Request method is not supported.");
  }
};

export const Profile = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod == "post") {
    return userService.CreateProfile(event);
  } else if (httpMethod == "put") {
    return userService.EditProfile(event);
  } else if (httpMethod == "get") {
    return userService.EditProfile(event);
  } else {
    return ErrorResponse(404, "Request method is not supported.");
  }
};

export const Cart = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod == "post") {
    return userService.CreateCart(event);
  } else if (httpMethod == "put") {
    return userService.UpdateCart(event);
  } else if (httpMethod == "get") {
    return userService.GetCart(event);
  } else {
    return ErrorResponse(404, "Request method is not supported.");
  }
};

export const Payment = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod == "post") {
    return userService.CreatePaymetMethod(event);
  } else if (httpMethod == "put") {
    return userService.UpdatePaymetMethod(event);
  } else if (httpMethod == "get") {
    return userService.GetPaymetMethod(event);
  } else {
    return ErrorResponse(404, "Request method is not supported.");
  }
};
