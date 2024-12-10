import jwt from 'jsonwebtoken';

const checkSession = async (req, res, next) => {
  try {
    // Get the token from the request header (Authorization header)
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized, no token provided.' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you have JWT_SECRET in .env file

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized, invalid token.' });
    }
    console.log(decoded)
    // Attach the decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Error verifying session:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default checkSession;


