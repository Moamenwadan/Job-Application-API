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
import { createHandler } from "graphql-http/lib/use/express";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { retreiveAllusers } from "./modules/User/query.resolver.js";
import { retreiveAllCompanies } from "./modules/Company/query.resolver.js";
import {
  approveCompany,
  banSpecificCompany,
} from "./modules/Company/mutation.resolver.js";
import { banSpecificuser } from "./modules/User/mutation.resolver.js";

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
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: {
        users: retreiveAllusers,
        companies: retreiveAllCompanies,
      },
    }),
    mutation: new GraphQLObjectType({
      name: "Mutation",
      fields: {
        bandedAndUnbaned: banSpecificCompany,
        banandUnbanedSpecificuser: banSpecificuser,
        approveCompany: approveCompany,
      },
    }),
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
  app.use("/:companyId/job", jobController);
  app.use("/job", jobController);
  app.use("/graphql", createHandler({ schema }));

  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};
export default boot;
