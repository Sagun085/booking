const jwt = require("jsonwebtoken");

exports.authenticate = function (req, res, next) {
  const token = req.headers.authorization;
  const key = process.env.JWT_KEY;
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  jwt.verify(token, key, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = JSON.parse(user.data);
    next();
  });
}