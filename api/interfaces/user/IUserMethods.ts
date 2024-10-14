export interface IUserMethods {
  matchPassword(password: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}
