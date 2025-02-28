import {
  graphql,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
export const companyType = new GraphQLObjectType({
  name: "fieldsOfcompany",
  fields: {
    companyName: { type: GraphQLString },
    address: { type: GraphQLString },
    companyEmail: { type: GraphQLString },
  },
});
