import express, { json, urlencoded, static as serveStatic } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./modules";
import log from "./middlewares/logRequest.mw";
import connectDatabase from "./utils/plugins/database";
import { errorHandler } from "./middlewares/errorHandler.mw";
import { test } from "./dev/test";

const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "capacitor://localhost",
      "https://express-control.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

connectDatabase();
test();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(serveStatic("public"));
app.use(helmet());
app.use(log);
// Router
app.use("/api/", router);
app.use(errorHandler);

// Export ứng dụng
export default app;
