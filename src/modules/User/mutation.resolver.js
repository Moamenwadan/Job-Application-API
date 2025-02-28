import User from "../../DB/models/user.model.js";
import isAuthenticatedGraph from "../../middleware/graphAuthentication..middleware.js";
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
export const banSpecificuser = {
  type: new GraphQLObjectType({
    name: "banUser",
    fields: {
      statusCode: { type: GraphQLInt },
      message: { type: GraphQLString },
    },
  }),
  args: {
    authorization: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
  resolve: async (parent, args) => {
    const user = await isAuthenticatedGraph(args.authorization, [
      "admin",
      //   "user",
    ]);
    const banUser = await User.findOne({
      _id: args.userId,
      //   CreatedBy: user._id,
    }).select("firstName lastName email password gender bannedAt");
    console.log(banUser.bannedAt);
    if (!banUser.bannedAt) {
      banUser.bannedAt = new Date();
      await banUser.save();
    } else if (banUser.bannedAt) {
      banUser.bannedAt = null;
      await banUser.save();
    }

    return {
      statusCode: 200,
      message: banUser.bannedAt ? "ban successfully" : "unbaned successfully",
    };
  },
};
