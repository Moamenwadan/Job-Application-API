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
export const retreiveAllCompanies = {
  type: new GraphQLObjectType({
    name: "retreiveAllCompanies",
    fields: {
      statusCode: { type: GraphQLInt },
      message: { type: GraphQLString },
      AllCompanies: {
        type: new GraphQLList(companyType),
      },
    },
  }),
  args: {
    authorization: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    await isAuthenticatedGraph(args.authorization, ["admin", "user"]);
    const AllCompanies = await Company.find({}).select(
      "companyName companyEmail email address "
    );
    return {
      statusCode: 200,
      message: "Retrieve all users successfully",
      AllCompanies: AllCompanies,
    };
  },
};

export const banSpecificCompany = {
  type: new GraphQLObjectType({
    name: "banUser",
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
