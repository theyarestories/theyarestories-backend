import { RegisteringEvent } from "@/interfaces/event/IEvent";
import { TypedRequestBody } from "@/interfaces/express/TypedRequestBody";
import advancedResults from "@/middlewares/advancedResults";
import EventModel from "@/schemas/EventSchema";
import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response, Router } from "express";

export default class EventsRouter {
  static router = Router();

  static init() {
    this.router.get("/", advancedResults(EventModel), this.getEvents);
    this.router.get("/statistics", this.getEventsStatistics);
    this.router.post("/", this.createEvent);

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
}
