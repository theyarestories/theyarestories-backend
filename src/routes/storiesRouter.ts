import { TypedRequestBody } from "@/interfaces/express/TypedRequestBody";
import { HttpStatusCode } from "axios";
import {
  RegisteringStory,
  RegisteringTranslatedFields,
} from "@/interfaces/story/IStory";
import { UserRole } from "@/interfaces/user/IUser";
import advancedResults from "@/middlewares/advancedResults";
import authorize from "@/middlewares/authorize";
import { protect } from "@/middlewares/protect";
import StoryModel from "@/schemas/StorySchema";
import ErrorResponse from "@/utils/errorResponse";
import storyHasLanguage from "@/utils/stories/storyHasLanguage";
import { NextFunction, Request, Response, Router } from "express";
import verifyDocument from "@/middlewares/verifyDocument";

export default class StoriesRouter {
  static router = Router();

  static init() {
    this.router.get(`/`, advancedResults(StoryModel), this.getStories);
    this.router.get(`/:id`, verifyDocument(StoryModel), this.getSignleStory);
    this.router.post(`/`, this.createStory);
    this.router.put(
      "/:id/share",
      verifyDocument(StoryModel),
      this.incrementStoryShares
    );
    this.router.put(
      "/:id/view",
      verifyDocument(StoryModel),
      this.incrementStoryViews
    );
    this.router.put(
      "/:id/translate",
      verifyDocument(StoryModel),
      this.translateStory
    );
    this.router.put(
      "/:id/approve",
      protect,
      authorize([UserRole.publisher, UserRole.admin]),
      verifyDocument(StoryModel),
      this.approveStory
    );

    return this.router;
  }

  /**
   * @desc      Gets all stories
   * @route     GET /api/v1/stories
   * @access    Public
   */
  static async getStories(req: Request, res: Response) {
    return res.status(HttpStatusCode.Ok).json(res.advancedResults);
  }

  /**
   * @desc      Gets a single story
   * @route     GET /api/v1/story/:id
   * @access    Public
   */
  static async getSignleStory(req: Request<{ id: string }>, res: Response) {
    res.status(HttpStatusCode.Ok).json({ success: true, data: req.document });
  }

  /**
   * @desc      Creates a new story
   * @route     POST /api/v1/story
   * @access    Public
   */
  static async createStory(
    req: TypedRequestBody<RegisteringStory>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const story = await StoryModel.create(req.body);

      res.status(HttpStatusCode.Created).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Increments the shares count of a story
   * @route     PUT /api/v1/story/:id/share
   * @access    Public
   */
  static async incrementStoryShares(
    req: Request<{ id: string }, any, { platform: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const story = await StoryModel.findByIdAndUpdate(
        req.params.id,
        { $inc: { ["shares." + req.body.platform]: 1 } },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Increments the views count of a story
   * @route     PUT /api/v1/story/:id/view
   * @access    Public
   */
  static async incrementStoryViews(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const story = await StoryModel.findByIdAndUpdate(
        req.params.id,
        { $inc: { viewsCount: 1 } },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Adds a story translation
   * @route     PUT /api/v1/story/:id/translate
   * @access    Public
   */
  static async translateStory(
    req: Request<
      { id: string },
      any,
      { translatedFields: RegisteringTranslatedFields }
    >,
    res: Response,
    next: NextFunction
  ) {
    if (
      req.document &&
      storyHasLanguage(
        req.document,
        req.body.translatedFields.translationLanguage
      )
    ) {
      const error = new ErrorResponse({
        message: `Story id: ${req.params.id} is already translated in ${req.body.translatedFields.translationLanguage}`,
        statusCode: HttpStatusCode.Conflict,
      });
      return next(error);
    }

    try {
      const updatedStory = await StoryModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            translations: req.body.translatedFields,
            protagonistTranslations: req.body.translatedFields.protagonist,
          },
        },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: updatedStory });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Approves a story
   * @route     PUT /api/v1/story/:id/approve
   * @access    Private
   */
  static async approveStory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    console.log("🍉", req.path, req.url, req.baseUrl, req.originalUrl);
    try {
      const updatedStory = await StoryModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            isApproved: true,
            approvedBy: req.user?.email || null,
            "translations.$[].isApproved": true,
            "translations.$[].approvedBy": req.user?.email || null,
          },
        },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: updatedStory });
    } catch (error) {
      next(error);
    }
  }
}
