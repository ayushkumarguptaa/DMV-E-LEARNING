import jwt from "jsonwebtoken";
export const IsLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 🔥 VERY IMPORTANT: use req.instructor
    req.instructor = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
