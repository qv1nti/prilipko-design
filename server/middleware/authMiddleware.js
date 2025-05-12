const jwt = require("jsonwebtoken");

// Перевіряє, що користувач залогінений
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

// Дозволяє доступ лише адміну
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden: лише для адміністратора" });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
