import jwt from "jsonwebtoken";

export function signJWT(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      isAdmin: !!user.isAdmin,
      isHumanAgent: !!user.isHumanAgent,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

export function authMiddleware(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export const requireAdmin = (req, res, next) =>
  req.user?.isAdmin ? next() : res.status(403).json({ error: "Admin only" });

export const requireAgent = (req, res, next) =>
  req.user?.isHumanAgent ? next() : res.status(403).json({ error: "Agent only" });
