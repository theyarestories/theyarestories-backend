declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOPPLER_ENVIRONMENT: "dev" | "stg" | "prd";
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_COOKIE_EXPIRE: string;
      FRONTEND_URL: string;
      HIGHLIGHT_PROJECT_ID: string;
      FORWARD_EMAIL_PASSWORD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
