export interface UserModel {
  user_id?: number;
  email: string;
  password: string;
  salt: string;
  phone: string;
  userType: "BUYER" | "SELLER";
}
