import User from "../../DB/models/user.model.js";
import { userType } from "./userTypes.js";
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
import isAuthenticatedGraph from "../../middleware/graphAuthentication..middleware.js";
export const retreiveAllusers = {
  type: new GraphQLObjectType({
    name: "retreiveAllUsers",
    fields: {
      statusCode: { type: GraphQLInt },
      message: { type: GraphQLString },
      AllUsers: {
        type: new GraphQLList(userType),
      },
    },
  }),
  args: {
    authorization: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    await isAuthenticatedGraph(args.authorization, ["admin"]);
    const AllUsers = await User.find({}).select(
      "firstName lastName email password gender"
    );
    return {
      statusCode: 200,
      message: "Retrieve all users successfully",
      AllUsers: AllUsers,
    };
  },
};
