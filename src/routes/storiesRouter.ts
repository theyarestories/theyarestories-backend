import HttpStatusCode from "@/interfaces/http-status-codes/HttpStatusCode";
import advancedResults from "@/middlewares/advancedResults";
import StoryModel from "@/schemas/StorySchema";
import ErrorResponse from "@/utils/errorResponse";
import { NextFunction, Request, Response, Router } from "express";

export default class StoriesRouter {
  static router = Router();

  static init() {
    this.router.get(`/`, advancedResults(StoryModel), this.getStories);
    this.router.get(`/:storyId`, this.getSignleStory);

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
}
