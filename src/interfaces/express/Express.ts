// declaration merging: https://blog.logrocket.com/extend-express-request-object-typescript/

import { IUser } from "../user/IUser";

declare global {
  namespace Express {
    export interface Request {
      user: IUser | null;
    }
    export interface Response {
      advancedResults: {
        success: boolean;
        count: number;
        totalCount: number;
        pagination: {
          currentPage: number;
          totalPages: number;
          limit: number;
        };
        data: any;
      };
    }
  }
}

export {};
