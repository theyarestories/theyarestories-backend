import { TypedRequestBody } from "@/interfaces/express/TypedRequestBody";
import HttpStatusCode from "@/interfaces/http-status-codes/HttpStatusCode";
import {
  RegisteringStory,
  RegisteringTranslatedFields,
} from "@/interfaces/story/IStory";
import advancedResults from "@/middlewares/advancedResults";
import StoryModel from "@/schemas/StorySchema";
import ErrorResponse from "@/utils/errorResponse";
import { NextFunction, Request, Response, Router } from "express";
import { Types } from "mongoose";

export default class StoriesRouter {
  static router = Router();

  static init() {
    this.router.get(`/`, advancedResults(StoryModel), this.getStories);
    this.router.get(`/:storyId`, this.getSignleStory);
    this.router.post(`/`, this.createStory);
    this.router.put("/:storyId/share", this.incrementStoryShares);
    this.router.put("/:storyId/view", this.incrementStoryViews);
    this.router.put("/:storyId/translate", this.translateStory);

    return this.router;
  }

  /**
   * @desc      Gets all stories
   * @route     GET /api/v1/stories
   * @access    Public
   */
  static async getStories(req: Request, res: Response) {
    return res.status(HttpStatusCode.OK).json(res.advancedResults);
  }

  /**
   * @desc      Gets a single story
   * @route     GET /api/v1/story/:storyId
   * @access    Public
   */
  static async getSignleStory(
    req: Request<{ storyId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const story = await StoryModel.findById(req.params.storyId);

      if (!story) {
        const error = new ErrorResponse({
          message: `Story not found with id: ${req.params.storyId}`,
          statusCode: HttpStatusCode.NOT_FOUND,
        });
        return next(error);
      }

      res.status(HttpStatusCode.OK).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
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
      // Create an ID for the translation
      const translationId = new Types.ObjectId();
      const firstTranslationKey = Object.keys(req.body.translations)[0];
      req.body.translations[firstTranslationKey]._id = translationId;
      req.body.translationId = translationId;

      const story = await StoryModel.create(req.body);

      res.status(HttpStatusCode.CREATED).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Increments the shares count of a story
   * @route     PUT /api/v1/story/:storyId/share
   * @access    Public
   */
  static async incrementStoryShares(
    req: Request<{ storyId: string }, any, { platform: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const story = await StoryModel.findByIdAndUpdate(
        req.params.storyId,
        { $inc: { ["shares." + req.body.platform]: 1 } },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.OK).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Increments the views count of a story
   * @route     PUT /api/v1/story/:storyId/view
   * @access    Public
   */
  static async incrementStoryViews(
    req: Request<{ storyId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const story = await StoryModel.findByIdAndUpdate(
        req.params.storyId,
        { $inc: { viewsCount: 1 } },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.OK).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Adds a story translation
   * @route     PUT /api/v1/story/:storyId/translate
   * @access    Public
   */
  static async translateStory(
    req: Request<
      { storyId: string },
      any,
      { language: string; translatedFields: RegisteringTranslatedFields }
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const story = await StoryModel.findByIdAndUpdate(
        req.params.storyId,
        {
          $set: {
            ["translations." + req.body.language]: req.body.translatedFields,
          },
        },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.OK).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }
}
