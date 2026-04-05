import { findUserByToken } from "./db.js";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = findUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  req.user = user;
  req.token = token;
  return next();
}

