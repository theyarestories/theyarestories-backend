// declaration merging: https://blog.logrocket.com/extend-express-request-object-typescript/

declare global {
  namespace Express {
    export interface Response {
      advancedResults: {
        success: boolean;
        count: number;
        totalCount: number;
        totalPages: number;
        pagination: {
          [key: string]: {
            page: number;
            limit: number;
          };
        };
        data: any;
      };
    }
  }
}

export {};
