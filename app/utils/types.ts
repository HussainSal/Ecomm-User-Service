import { UserModel } from "app/models/UserModel";

export type TokenSuccess = {
  ok: true;
  user: UserModel;
};

export type TokenFailure = {
  ok: false;
};
