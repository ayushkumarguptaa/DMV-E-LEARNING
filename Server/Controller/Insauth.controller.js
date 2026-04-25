import express from 'express'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = express.Router();

/*Instructor Register*/

export const register = async (req, res) => {
  try {
    const { name, email, phone, specialization } = req.body;

    // Validation
    if (!name || !email || !phone || !specialization) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if instructor already exists
    const existing = await pool.query(
      "SELECT id FROM instructors WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Instructor already exists",
      });
    }

    // Insert instructor (NO password, NO cookie, NO token)
    const result = await pool.query(
      `INSERT INTO instructors
       (name, email, phone, specialization, approval_status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, email, approval_status`,
      [name, email.toLowerCase(), phone, specialization]
    );

    const instructor = result.rows[0];

    return res.status(201).json({
      success: true,
      message: "Registration successful. Await admin approval.",
      instructor: {
        id: instructor.id,
        email: instructor.email,
        approval_status: instructor.approval_status,
      },
    });
  } catch (error) {
    console.error("Instructor Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




/* ======================
   Instructor Login
====================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Find instructor by email
    const result = await pool.query(
      `SELECT id, name, email, password, approval_status, is_first_login
       FROM instructors
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const instructor = result.rows[0];

    // Check approval status
    if (instructor.approval_status !== "approved") {
      return res.status(403).json({
        error: "Instructor not approved by admin",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, instructor.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: instructor.id,
        email: instructor.email,
        role: "instructor",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: false,      // OK for localhost
  sameSite: "lax",    // 🔥 must be LAX on http         // important
  maxAge: 24 * 60 * 60 * 1000,
});




    // Response (no password)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      instructor: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        is_first_login: instructor.is_first_login,
      },
    });
  } catch (error) {
    console.error("Instructor Login Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
// CHECK LOGIN
export const me = async(req, res) => {
  res.status(200).json({
    loggedIn: true,
    instructor: req.instructor,
  });
}

export const logout = async(req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
    secure: false,
    sameSite: "lax"
});


  res.status(200).json({ message: "Logged out successfully" });
}



export default router
