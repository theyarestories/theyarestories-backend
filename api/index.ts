import http from "http";
import app from "./app";
import connectDB from "./db";

const server = http.createServer(app);

server.listen(process.env.PORT, async () => {
  console.log(
    `App listening in ${process.env.DOPPLER_ENVIRONMENT} mode on http://localhost:${process.env.PORT} 🚀`
  );
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
});

// handle unhandled promise rejections
process.on("unhandledRejection", function (error: Error, promise) {
  console.log(`error: ${error.message}`);
  server.close(() => process.exit(1)); // "1": failure code
});

export default server;
