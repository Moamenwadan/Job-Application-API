import User from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/token.js";
// import { roles } from "../DB/models/user.model.js";
// import { roles } from "../DB/models/user.model.js";
const isAuthenticatedGraph = async (authorization, accessRoles) => {
  if (!authorization || !authorization.startsWith("Bearer"))
    throw new Error("you doesn't send token");

  const token = authorization.split(" ")[1];
  const decoded = verifyToken({ token });

  const user = await User.findOne({ _id: decoded.id, email: decoded.email });
  if (!user) throw new Error("the user doesn't exist");
  if (!accessRoles.includes(user.role))
    throw new Error("the user not authorized");
  return user;
};
export default isAuthenticatedGraph;
