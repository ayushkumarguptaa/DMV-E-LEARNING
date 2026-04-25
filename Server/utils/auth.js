import jwt from "jsonwebtoken";

export const IsLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token)

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.instructor = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
