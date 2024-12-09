const { getSession } = require("next-auth/react");

const checkSession = async (req, res, next) => {
  try {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.session = session;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkSession;

