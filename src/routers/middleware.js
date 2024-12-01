import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
  const auth = req.headers?.authorization;

  console.log(auth,'auth')
  if (!auth) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  try {
    // Extract the token from the "Bearer <token>" format
    const token = auth.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // Add the decoded user information to the request object
    req.user = decodedToken;

    // Proceed to the next middleware
    next();
  } catch (err) {
    return res.status(403).json({
      message: 'Invalid token',
      error: err.message,
    });
  }
};
