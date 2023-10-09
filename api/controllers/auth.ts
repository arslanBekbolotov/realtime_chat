import { User } from "../models/User";

const auth = async (token: string) => {
  if (!token) {
    return { error: "No token present" };
  }

  const user = await User.findOne({ token }).select("displayName username");

  if (!user) {
    return { error: "Wrong token!" };
  }

  return {
    _id: user._id,
    displayName: user.displayName,
    role: user.role,
    username: user.username,
  };
};

export default auth;
