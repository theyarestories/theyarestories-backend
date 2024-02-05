import { EventType, RegisteringEvent } from "@/interfaces/event/IEvent";
import { TypedRequestBody } from "@/interfaces/express/TypedRequestBody";
import advancedResults from "@/middlewares/advancedResults";
import EventModel from "@/schemas/EventSchema";
import StoryModel from "@/schemas/StorySchema";
import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response, Router } from "express";

export default class EventsRouter {
  static router = Router();

  static init() {
    this.router.get("/", advancedResults(EventModel), this.getEvents);
    this.router.get("/statistics", this.getEventsStatistics);
    this.router.post("/", this.createEvent);
    this.router.get("/seed", this.seedEvents);

    return this.router;
  }

  /**
   * @desc      Gets all events
   * @route     GET /api/v1/events
   * @access    Public
   */
  static async getEvents(req: Request, res: Response) {
    return res.status(HttpStatusCode.Ok).json(res.advancedResults);
  }

  /**
   * @desc      Gets events statistics
   * @route     GET /api/v1/events/statistics
   * @access    Public
   */
  static async getEventsStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let result = await EventModel.aggregate([
        { $match: { type: { $exists: true } } },
        { $group: { _id: "$type", count: { $count: {} } } },
      ]);
      result = result.reduce(
        (prev, curr) => Object.assign(prev, { [curr._id]: curr.count }),
        {}
      );
      return res.status(HttpStatusCode.Ok).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Creates a new event
   * @route     POST /api/v1/events
   * @access    Public
   */
  static async createEvent(
    req: TypedRequestBody<RegisteringEvent>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const event = await EventModel.create(req.body);

      res.status(HttpStatusCode.Created).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async seedEvents(
    req: TypedRequestBody<RegisteringEvent>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const allStories = await StoryModel.find();
      for (const story of allStories) {
        const createEvent = await EventModel.findOne({
          type: EventType.write_story,
          "metadata.storyId": story._id,
        });
        if (!createEvent && story.isApproved) {
          await EventModel.create({
            type: EventType.write_story,
            metadata: {
              storyId: story._id,
              storyLanguage: story.translationLanguage,
              storyProtagonist: story.protagonist,
            },
          });
        }

        for (const translation of story.translations.slice(1)) {
          const translationEvent = await EventModel.findOne({
            type: EventType.translate_story,
            "metadata.translationId": translation._id,
          });
          if (!translationEvent && translation.isApproved) {
            await EventModel.create({
              type: EventType.translate_story,
              metadata: {
                translationId: translation._id,
                translationLanguage: translation.translationLanguage,
                storyId: story._id,
                storyProtagonist: translation.protagonist,
              },
            });
          }
        }
      }

      res.status(HttpStatusCode.Ok).json({ success: true, data: allStories });
    } catch (error) {
      next(error);
    }
  }
}
