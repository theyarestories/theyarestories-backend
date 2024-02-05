import { TypedRequestBody } from "@/interfaces/express/TypedRequestBody";
import { HttpStatusCode } from "axios";
import {
  IStory,
  RegisteringStory,
  RegisteringTranslation,
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
import { IEmoji } from "@/interfaces/story/IEmoji";

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
    this.router.put("/:id/emoji", verifyDocument(StoryModel), this.emojiStory);
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
    this.router.put(
      "/:id/translations/:translationId/approve",
      protect,
      authorize([UserRole.publisher, UserRole.admin]),
      verifyDocument(StoryModel),
      this.approveTranslation
    );
    this.router.put(
      "/:id",
      protect,
      authorize([UserRole.publisher, UserRole.admin]),
      verifyDocument(StoryModel),
      this.updateStory
    );
    this.router.delete(
      "/:id",
      protect,
      authorize([UserRole.admin]),
      verifyDocument(StoryModel),
      this.deleteStory
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
   * @route     GET /api/v1/stories/:id
   * @access    Public
   */
  static async getSignleStory(req: Request<{ id: string }>, res: Response) {
    res.status(HttpStatusCode.Ok).json({ success: true, data: req.document });
  }

  /**
   * @desc      Creates a new story
   * @route     POST /api/v1/stories
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
   * @route     PUT /api/v1/stories/:id/share
   * @access    Public
   */
  static async incrementStoryShares(
    req: Request<{ id: string }, unknown, { platform: string }>,
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
   * @route     PUT /api/v1/stories/:id/view
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
   * @desc      Emojies a story
   * @route     PUT /api/v1/stories/:id/emoji
   * @access    Public
   */
  static async emojiStory(
    req: Request<{ id: string }, unknown, IEmoji>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const isEmojied = req.document.emojis.some(
        (emoji: IEmoji) =>
          emoji.userId === req.body.userId &&
          emoji.emojiType === req.body.emojiType
      );
      const story = await StoryModel.findByIdAndUpdate(
        req.params.id,
        isEmojied
          ? {
              $pull: {
                emojis: {
                  userId: req.body.userId,
                  emojiType: req.body.emojiType,
                },
              },
            }
          : { $push: { emojis: req.body } },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: story });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Adds a story translation
   * @route     PUT /api/v1/stories/:id/translate
   * @access    Public
   */
  static async translateStory(
    req: Request<
      { id: string },
      unknown,
      { translatedFields: RegisteringTranslation }
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
   * @route     PUT /api/v1/stories/:id/approve
   * @access    Private: admin, publisher
   */
  static async approveStory(
    req: Request<{ id: string }, unknown, RegisteringStory>,
    res: Response,
    next: NextFunction
  ) {
    // 1. Add approve props
    const registeringStory = req.body;
    registeringStory.isApproved = true;
    registeringStory.approvedBy = req.user?.email;
    registeringStory.translations[0].isApproved = true;
    registeringStory.translations[0].approvedBy = req.user?.email;

    try {
      // 2. update story to be approved
      const updatedStory = await StoryModel.findByIdAndUpdate(
        req.params.id,
        registeringStory,
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: updatedStory });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Approves a translation
   * @route     PUT /api/v1/stories/:id/translations/:translationId/approve
   * @access    Private: admin, publisher
   */
  static async approveTranslation(
    req: Request<
      { id: string; translationId: string },
      unknown,
      RegisteringTranslation
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updatedStory = await StoryModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            "translations.$[elem].protagonist": req.body.protagonist,
            "translations.$[elem].story": req.body.story,
            "translations.$[elem].job": req.body.job,
            "translations.$[elem].isApproved": true,
            "translations.$[elem].approvedBy": req.user?.email || null,
          },
        },
        {
          arrayFilters: [{ "elem._id": req.params.translationId }],
          returnDocument: "after",
        }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: updatedStory });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Updates a story
   * @route     PUT /api/v1/stories/:id
   * @access    Private: admin, publisher
   */
  static async updateStory(
    req: Request<{ id: string }, unknown, IStory>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updatedStory = await StoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: updatedStory });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Deletes a story
   * @route     DELETE /api/v1/stories/:id
   * @access    Private: admin
   */
  static async deleteStory(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const updatedStory = await StoryModel.findByIdAndUpdate(
        req.params.id,
        { $set: { isDeleted: true } },
        { returnDocument: "after" }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: updatedStory });
    } catch (error) {
      next(error);
    }
  }
}
