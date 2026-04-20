import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchUsers = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();

  if (!q) {
    return res.status(200).json({ users: [] });
  }

  const users = await User.find({
    _id: { $ne: req.user.id },
    $or: [
      { name: { $regex: q, $options: "i" } },
      { username: { $regex: q.replace(/^@/, ""), $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  })
    .select("name username email avatar")
    .limit(8);

  return res.status(200).json({ users });
});
