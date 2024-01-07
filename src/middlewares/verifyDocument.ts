import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { HttpStatusCode } from "axios";
import ErrorResponse from "@/utils/errorResponse";

export default function <T>(model: Model<T>) {
  return async function verifyDocument(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const document = await model.findById(req.params.id);
      if (!document) {
        const error = new ErrorResponse({
          message: `Document with id: ${req.params.id} not found in ${model.modelName} collection`,
          statusCode: HttpStatusCode.NotFound,
        });
        return next(error);
      }
      req.document = document;
      next();
    } catch (error) {
      return next(error);
    }
  };
}
