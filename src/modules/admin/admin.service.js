import User from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHanler.js";

export const changeRole = asyncHandler(async (req, res, next) => {
  const find = await User.findById(req.body._id);
  console.log(find);
  const user = await User.findOneAndUpdate(
    { _id: req.body.id },
    {
      role: req.body.role,
    },
    { new: true, runValidators: true }
  );
  return res.json({ success: true, user });
});
