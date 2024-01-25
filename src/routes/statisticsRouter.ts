import { TypedRequestBody } from "@/interfaces/express/TypedRequestBody";
import { RegisteringStatistic } from "@/interfaces/statistic/IStatistic";
import StatisticModel from "@/schemas/StatisticSchema";
import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response, Router } from "express";

export default class StatisticsRouter {
  static router = Router();

  static init() {
    this.router.get("/", this.getStatistics);
    this.router.post("/", this.createStatistic);
    this.router.put("/increment-stories-views", this.incrementStoriesViews);
    this.router.put("/increment-visits", this.incrementVisits);

    return this.router;
  }

  /**
   * @desc      Gets statistics
   * @route     GET /api/v1/statistics
   * @access    Public
   */
  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const statistic = (await StatisticModel.find().sort({ $natural: -1 }))[0];

      res.status(HttpStatusCode.Ok).json({ success: true, data: statistic });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Increments stories views
   * @route     PUT /api/v1/statistics/views
   * @access    Public
   */
  static async incrementStoriesViews(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await StatisticModel.updateMany(
        {},
        { $inc: { viewStoryCount: 1 } }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Increments visits
   * @route     PUT /api/v1/statistics/visits
   * @access    Public
   */
  static async incrementVisits(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await StatisticModel.updateMany(
        {},
        { $inc: { visitCount: 1 } }
      );

      res.status(HttpStatusCode.Ok).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Creates a new statistic
   * @route     POST /api/v1/statistics
   * @access    Public
   */
  static async createStatistic(
    req: TypedRequestBody<RegisteringStatistic>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const statistic = await StatisticModel.create(req.body);

      res
        .status(HttpStatusCode.Created)
        .json({ success: true, data: statistic });
    } catch (error) {
      next(error);
    }
  }
}
