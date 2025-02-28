import Company from "../../DB/models/company.model.js";
import isAuthenticatedGraph from "../../middleware/graphAuthentication..middleware.js";
import { companyType } from "./companyTypes.js";
import {
  graphql,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from "graphql";
export const banSpecificCompany = {
  type: new GraphQLObjectType({
    name: "banCompany",
    fields: {
      statusCode: { type: GraphQLInt },
      message: { type: GraphQLString },
    },
  }),
  args: {
    authorization: { type: GraphQLString },
    companyId: { type: GraphQLID },
  },
  resolve: async (parent, args) => {
    const user = await isAuthenticatedGraph(args.authorization, [
      "admin",
      "user",
    ]);
    const company = await Company.findOneAndUpdate({
      _id: args.companyId,
      //   CreatedBy: user._id,
    }).select("companyName companyEmail email address bannedAt");
    console.log(company.bannedAt);
    if (!company.bannedAt) {
      company.bannedAt = new Date();
      await company.save();
    } else if (company.bannedAt) {
      company.bannedAt = null;
      await company.save();
    }

    return {
      statusCode: 200,
      message: company.bannedAt ? "ban successfully" : "unbaned successfully",
    };
  },
};
export const approveCompany = {
  type: new GraphQLObjectType({
    name: "approveCompany",
    fields: {
      statusCode: { type: GraphQLInt },
      message: { type: GraphQLString },
    },
  }),
  args: {
    authorization: { type: GraphQLString },
    companyId: { type: GraphQLID },
  },
  resolve: async (parent, args) => {
    const user = await isAuthenticatedGraph(args.authorization, ["admin"]);
    const company = await Company.findOneAndUpdate({
      _id: args.companyId,
      //   CreatedBy: user._id,
    }).select("companyName companyEmail email address approvedByAdmin");
    company.approvedByAdmin = true;
    company.save();

    return {
      statusCode: 200,
      message: "approved successfully",
    };
  },
};
