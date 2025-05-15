const jwt = require("jsonwebtoken");

// 🔐 Middleware: авторизований користувач
const required = (req, res, next) => {
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
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// 🔐 Middleware: лише для адміністратора
const requiredAdmin = (req, res, next) => {
  required(req, res, () => {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }
    next();
  });
};

// 🟡 Middleware: не обов’язкова авторизація
const optional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // неавторизований — дозволити
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
  } catch {
    req.userId = null;
    req.userRole = null;
  }

  next();
};

module.exports = {
  required,
  requiredAdmin,
  optional,
};
