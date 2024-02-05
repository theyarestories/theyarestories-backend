import { NextFunction, Request, Response, Router } from "express";
import UserModel from "@/schemas/UserSchema";
import ErrorResponse from "@/utils/errorResponse";
import advancedResults from "@/middlewares/advancedResults";
import { HttpStatusCode } from "axios";

export default class UsersRouter {
  static router = Router();

  static init() {
    this.router.get("/", advancedResults(UserModel), this.getUsers);
    this.router.get("/:userId", this.getUser);

    return this.router;
  }

  /**
   * @desc      Gets all users
   * @route     GET /api/v1/users
   * @access    Public
   */
  private static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.status(HttpStatusCode.Ok).json(res.advancedResults);
  }

  /**
   * @desc      Gets a single user
   * @route     GET /api/v1/users/:userId
   * @access    Public
   */
  private static async getUser(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserModel.findById(req.params.userId);

      if (!user) {
        const error = new ErrorResponse({
          message: `User not found with id: ${req.params.userId}`,
          statusCode: HttpStatusCode.NotFound,
        });
        return next(error);
      }

      res.status(HttpStatusCode.Ok).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}
