import { UserRole } from "@/interfaces/user/IUser";
import ErrorResponse from "@/utils/errorResponse";
import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";

export default function authorize(roles: UserRole[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      const error = new ErrorResponse({
        message: "Not authorized to access this route",
        statusCode: HttpStatusCode.Unauthorized,
      });
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new ErrorResponse({
        message: `User role "${req.user.role}" not authorized to access this route`,
        statusCode: HttpStatusCode.Forbidden,
      });
      return next(error);
    }
    next();
  };
}
