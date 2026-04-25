import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, accepted_terms } = req.body;

    //Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!accepted_terms) {
      return res.status(400).json({
        success: false,
        message: "You must accept Terms & Conditions",
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      `SELECT id FROM client WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insert user
    const result = await pool.query(
      `INSERT INTO client (username, email, password, accepted_terms)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email`,
      [username, email.toLowerCase(), hashedPassword, true]
    );

    const newUser = result.rows[0];

    //Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    //Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //Response
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    //Find user by email
    const result = await pool.query(
      `SELECT id, username, email, password 
       FROM client 
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    //Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Response (do NOT send password)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
// logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,      // true in production
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
