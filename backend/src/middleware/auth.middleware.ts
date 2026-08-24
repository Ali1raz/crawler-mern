import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { User, UserDocument } from "../models/user.model";

export interface AuthedRequest extends Request {
  user?: UserDocument;
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  let user = (await User.findOne({ clerkId: userId })) as UserDocument | null;

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(userId);

    try {
      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      });
    } catch (err: any) {
      if (err.code === 11000) {
        user = (await User.findOne({ clerkId: userId })) as UserDocument;
      } else {
        throw err;
      }
    }
  }

  req.user = user;
  next();
}
