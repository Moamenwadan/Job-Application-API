// import express from "express";
import connectDB from "./DB/connection.js";
import userController from "./modules/User/user.controller.js";
import adminController from "./modules/admin/admin.controller.js";
import companyController from "./modules/Company/company.controller.js";
import authController from "./modules/Auth/auth.controller.js";
import globalErrorHandler from "./utils/errorHandling/globalErrorHandler.js";
import notFoundHandler from "./utils/errorHandling/notFoundHandler.js";
import jobController from "./modules/Job/job.controller.js";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
const boot = async (app, express) => {
  app.use(cors());
  await connectDB();
  // const whitList = ["http://localhost:3000", "http://localhost:5000"];

  // app.use((req, res, next) => {
  //   const origin = req.header("Origin");
  //   console.log(origin);
  //   if (!whitList.includes(origin)) {
  //     return next(new Error("Blocked by cors"));
  //   }
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  //   res.setHeader("Access-Control-Allow-Headers", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "*");
  //   res.setHeader("Access-Control-Private-Network", true);
  //   return next();
  // });
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 3,
    message: "Excceed the limit",
    skipSuccessfulRequests: true,
    statusCode: 428,
    legacyHeaders: true,
    standardHeaders: false,
    handler: (req, res, next, options) => {
      return next(
        new Error("Excceed the limit", { cause: options.statusCode })
      );
    },
    keyGenerator: (req, res, next) => {
      return req.ip;
    },
    requestPropertyName: "route",
    requestWasSuccessful: (req, res) => {
      return res.statusCode < 400;
    },
  });

  app.use(limiter);
  app.use(helmet());
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.get("/", (req, res, next) => {
    return res
      .status(200)
      .json({ message: "welcome the node js file from express" });
  });

  app.use("/auth", authController);
  app.use("/users", userController);
  app.use("/admin", adminController);
  app.use("/company", companyController);
  app.use("/job", jobController);

  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};
export default boot;
