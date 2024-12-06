import { getSession } from "next-auth/react";

export const checkSession = async (req, res, next) => {
  try {
    const session = await getSession({ req });  // Get session from the request

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user session to the request object
    req.session = session;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
