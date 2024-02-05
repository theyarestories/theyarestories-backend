import {
  CookieOptions,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import { Document } from "mongoose";
import UserModel from "@/schemas/UserSchema";
import ErrorResponse from "@/utils/errorResponse";
import { IUser, RegisteringUser } from "@/interfaces/user/IUser";
import { IUserMethods } from "@/interfaces/user/IUserMethods";
import { HttpStatusCode } from "axios";
import { protect } from "@/middlewares/protect";
import StoryModel from "@/schemas/StorySchema";
import { TypedRequestBody } from "@/interfaces/express/TypedRequestBody";

export default class AuthRouter {
  // todo: set logger
  static router = Router();

  static init(): Router {
    this.router.post("/register", this.register);
    this.router.post("/login", this.login);
    this.router.get("/me", protect, this.getMe);

    return this.router;
  }

  /**
   * Using a cookie is safer than storing the token in the local storage
   * Get token from model, create cookie and send response
   */
  private static sendTokenResponse(
    user: Document<{}, {}, IUser> & IUserMethods,
    statusCode: number,
    res: Response
  ) {
    // Create token
    const token = user.getSignedJwtToken();

    const JWT_COOKIE_EXPIRE = Number(process.env.JWT_COOKIE_EXPIRE) ?? 30;

    const options: CookieOptions = {
      expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true, // because we want the cookie to only be accessed through the client-side
    };

    if (process.env.DOPPLER_ENVIRONMENT === "prd") {
      options.secure = true;
    }

    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  }

  /**
   * After a user signs in/up
   * replaces all his Mixpanel IDs in the database
   * with his actual ID
   */
  private static async replaceMixpanelId(
    mixpanelId: string,
    userId: string,
    next: NextFunction
  ) {
    try {
      // Update stories authors
      await StoryModel.updateMany(
        { author: mixpanelId },
        { $set: { author: userId } }
      );
      // Update translations authors
      await StoryModel.updateMany(
        { "translations.author": mixpanelId },
        { $set: { "translations.$[elem].author": userId } },
        { arrayFilters: [{ "elem.author": mixpanelId }] }
      );
      // Update emojis' user ID
      await StoryModel.updateMany(
        { "emojis.userId": mixpanelId },
        { $set: { "emojis.$[elem].userId": userId } },
        { arrayFilters: [{ "elem.userId": mixpanelId }] }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Register user
   * @route     POST /api/v1/auth/register
   * @access    Public: any user can access
   */
  private static async register(
    req: Request<{}, {}, RegisteringUser>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserModel.create(req.body);
      await AuthRouter.replaceMixpanelId(
        req.body.mixpanelId,
        user._id.toString(),
        next
      );
      AuthRouter.sendTokenResponse(user, HttpStatusCode.Created, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Login user
   * @route     POST /api/v1/auth/login
   * @access    Public: any user can access
   */
  private static async login(
    req: TypedRequestBody<{
      email: string;
      password: string;
      mixpanelId: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const { email, password } = req.body;

    // Verify email and password
    if (!email || !password) {
      const error = new ErrorResponse({
        message: "Please provide an email and password",
        statusCode: HttpStatusCode.BadRequest,
      });
      return next(error);
    }

    try {
      // Check email
      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        const error = new ErrorResponse({
          message: "Invalid credentials",
          statusCode: HttpStatusCode.Unauthorized,
        });
        return next(error);
      }

      // Check password
      const passwordIsMatch = await user.matchPassword(password);

      if (!passwordIsMatch) {
        const error = new ErrorResponse({
          message: "Invalid credentials",
          statusCode: HttpStatusCode.Unauthorized,
        });
        return next(error);
      }

      await AuthRouter.replaceMixpanelId(
        req.body.mixpanelId,
        user._id.toString(),
        next
      );
      AuthRouter.sendTokenResponse(user, HttpStatusCode.Ok, res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Get logged-in user
   * @route     GET /api/v1/auth/me
   * @access    Private
   */
  private static async getMe(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
}
