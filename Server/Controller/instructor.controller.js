import pool from "../config/db.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const getAllInstructors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        email, 
        phone, 
        specialization, 
        approval_status,
        linkedin_url,
        twitter_url,
        github_url
       FROM instructors
       ORDER BY id DESC`
    );

    res.json({
      success: true,
      instructors: result.rows,
    });
  } catch (error) {
    console.error("Fetch Instructors Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE STATUS
export const updateInstructorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved | rejected

    /* =========================
       VALIDATION
    ========================= */
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    /* =========================
       FETCH INSTRUCTOR
    ========================= */
    const instructorResult = await pool.query(
      "SELECT email FROM instructors WHERE id = $1",
      [id]
    );

    if (instructorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const email = instructorResult.rows[0].email;

    /* =========================
       IF REJECTED
    ========================= */
    if (status === "rejected") {
      await pool.query(
        `UPDATE instructors
         SET approval_status = 'rejected'
         WHERE id = $1`,
        [id]
      );

      return res.json({
        success: true,
        message: "Instructor rejected successfully",
      });
    }

    /* =========================
       IF APPROVED → GENERATE PASSWORD
    ========================= */

    // 🔐 Generate random password
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
    let randomPart = "";
    for (let i = 0; i < 8; i++) {
      randomPart += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    const plainPassword = `dmv-learning-${randomPart}`;

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 💾 Update DB
    await pool.query(
      `UPDATE instructors
       SET approval_status = 'approved',
           password = $1,
           is_first_login = true
       WHERE id = $2`,
      [hashedPassword, id]
    );

    /* =========================
       SEND EMAIL
    ========================= */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DMV Learning" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Instructor Account Approved 🎉",
      html: `
        <h2>Welcome to DMV Learning</h2>
        <p>Your instructor account has been <b>approved</b>.</p>

        <h3>Login Credentials</h3>
        <p><b>Email:</b> ${email}</p>
        <p><b>Password:</b> ${plainPassword}</p>

        <p style="color:red;">
          Please change your password after first login.
        </p>

        <br/>
        <p>Regards,<br/>DMV Learning Team</p>
      `,
    });

    /* =========================
       RESPONSE
    ========================= */
    return res.json({
      success: true,
      message:
        "Instructor approved successfully. Login credentials sent via email.",
    });
  } catch (error) {
    console.error("Update Instructor Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// 
export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if instructor exists
    const result = await pool.query(
      "SELECT id FROM instructors WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Delete instructor
    await pool.query(
      "DELETE FROM instructors WHERE id = $1",
      [id]
    );

    return res.json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    console.error("Delete Instructor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// 
export const getCurrentInstructor = async (req, res) => {
  try {
    const instructorId = req.instructor.id;

    const result = await pool.query(
      `
      SELECT 
        id,
        name,
        email,
        phone,
        specialization,
        approval_status,
        is_first_login,
        created_at
      FROM instructors
      WHERE id = $1
      `,
      [instructorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      success: true,
      instructor: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor details",
    });
  }
};
// 

// Change password & set is_first_login = false
export const changeInstructorPassword = async (req, res) => {
  try {
    const instructorId = req.instructor.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const result = await pool.query(
      "SELECT password FROM instructors WHERE id = $1",
      [instructorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const instructor = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, instructor.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE instructors 
       SET password = $1, is_first_login = false 
       WHERE id = $2`,
      [hashedPassword, instructorId]
    );

    res.status(200).json({
      message: "Password changed successfully",
      is_first_login: false,
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// 

export const addCourse = async (req, res) => {
  try {
    const {
      name,
      description,
      level,
      category,
      type,
      price,
      duration,
      total_lectures,
      total_quizzes,
      certificate_of_completion,
      full_lifetime_access,
    } = req.body;

    const instructor_id = req.instructor.id; // comes from JWT middleware

    // Validation
    if (!name || !description || !level || !category || !type) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (type === "Paid" && (!price || Number(price) <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0 for paid courses",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Course image is required",
      });
    }

    const imageUrl = req.file.path;

    const certificate =
      certificate_of_completion === "true" ||
      certificate_of_completion === true;

    const lifetimeAccess =
      full_lifetime_access === "true" ||
      full_lifetime_access === true;

    const lectures = Number(total_lectures) || 0;
    const quizzes = Number(total_quizzes) || 0;

    const result = await pool.query(
      `
      INSERT INTO courses (
        name,
        description,
        image_url,
        level,
        category,
        type,
        price,
        duration,
        total_lectures,
        total_quizzes,
        certificate_of_completion,
        full_lifetime_access,
        instructor_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
      `,
      [
        name,
        description,
        imageUrl,
        level,
        category,
        type,
        type === "Paid" ? Number(price) : 0,
        duration || "N/A",
        lectures,
        quizzes,
        certificate,
        lifetimeAccess,
        instructor_id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Add Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// GET COURSES
// GET COURSES
export const getCourses = async (req, res) => {
  try {
    console.log("Instructor:", req.instructor); // debug check

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        description,
        image_url,
        level,
        category,
        type,
        price,
        duration,
        total_lectures,
        total_quizzes,
        certificate_of_completion,
        full_lifetime_access,
        status
      FROM courses
      WHERE instructor_id = $1
      ORDER BY id DESC
      `,
      [req.instructor.id]   // ✅ correct based on your middleware
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};


// DELETE COURSES

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const result = await pool.query(
      "DELETE FROM courses WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};
// EDIT COURSES

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      level,
      category,
      type,
      price,
      duration,
      total_lectures,
      total_quizzes,
      certificate_of_completion,
      full_lifetime_access,
      instructor_id,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    /* Check course exists */
    const checkCourse = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [id]
    );

    if (checkCourse.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    /* Image update (optional) */
    let imageUrl = checkCourse.rows[0].image_url;
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    /* Boolean fix */
    const certificate =
      certificate_of_completion !== undefined
        ? certificate_of_completion === "true" || certificate_of_completion === true
        : checkCourse.rows[0].certificate_of_completion;

    const lifetimeAccess =
      full_lifetime_access !== undefined
        ? full_lifetime_access === "true" || full_lifetime_access === true
        : checkCourse.rows[0].full_lifetime_access;

    /* Numeric fix */
const lecturesValue = Number(total_lectures);
const quizzesValue = Number(total_quizzes);

const lectures = !isNaN(lecturesValue)
  ? lecturesValue
  : checkCourse.rows[0].total_lectures;

const quizzes = !isNaN(quizzesValue)
  ? quizzesValue
  : checkCourse.rows[0].total_quizzes;

    /* Price validation */
    if (type === "Paid" && (!price || Number(price) <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0 for paid courses",
      });
    }

    const updatedCourse = await pool.query(
      `
      UPDATE courses
      SET
        name = $1,
        description = $2,
        image_url = $3,
        level = $4,
        category = $5,
        type = $6,
        price = $7,
        duration = $8,
        total_lectures = $9,
        total_quizzes = $10,
        certificate_of_completion = $11,
        full_lifetime_access = $12,
        instructor_id = $13,
        updated_at = NOW()
      WHERE id = $14
      RETURNING *
      `,
      [
        name || checkCourse.rows[0].name,
        description || checkCourse.rows[0].description,
        imageUrl,
        level || checkCourse.rows[0].level,
        category || checkCourse.rows[0].category,
        type || checkCourse.rows[0].type,
        type === "Paid" ? Number(price) : 0,
        duration || checkCourse.rows[0].duration,
        lectures,
        quizzes,
        certificate,
        lifetimeAccess,
        instructor_id || checkCourse.rows[0].instructor_id,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse.rows[0],
    });
  } catch (error) {
    console.error("Edit Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};
// GET CURRENT LOGGEDIN INSTRUCTOR
// 
// 
// 
// ADD CLASS

export const addClass = async (req, res) => {
  try {
    // instructor id from JWT (IsLoggedIn middleware)
    const instructorId = req.instructor.id;

    const {
      title,
      mentor,
      description,
      status,
      startDate,
      category,
      level,
      price,
      amount,
      language,
    } = req.body;

    if (!title || !mentor || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Title, mentor and date are required",
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Upload failed" });
    }

    const thumbnail = req.file.path;

    const finalAmount =
      price === "Paid" && amount ? Number(amount) : 0;

    await pool.query(
      `
      INSERT INTO classes
      (
        class_title,
        mentor_name,
        class_date,
        category,
        level,
        price_type,
        amount,
        language,
        status,
        thumbnail,
        description,
        instructor_id
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      `,
      [
        title,          // $1
        mentor,         // $2
        startDate,      // $3
        category,       // $4
        level,          // $5
        price,          // $6 -> price_type
        finalAmount,    // $7 -> amount
        language,       // $8
        status,         // $9
        thumbnail,      // $10
        description,    // $11
        instructorId,   // $12 -> instructor_id
      ]
    );

    res.status(201).json({
      success: true,
      message: "Class added successfully",
    });
  } catch (error) {
    console.error("Add Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// GET ALL CLASSES
export const getAllClasses = async (req, res) => {
  try {
    // assuming instructor id is stored in req.instructor after login middleware
    const instructorId = req.instructor.id;

    const query = `
      SELECT
        id,
        class_title   AS title,
        mentor_name   AS mentor,
        class_date    AS startDate,
        category,
        level,
        price_type    AS price,
        amount,
        language,
        status,
        thumbnail,
        description
      FROM classes
      WHERE instructor_id = $1
      ORDER BY id DESC
    `;

    const { rows } = await pool.query(query, [instructorId]);

    res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Get Instructor Classes Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor classes",
    });
  }
};

// Delete classes
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
    }

    const result = await pool.query(
      "DELETE FROM classes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Delete Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// EDIT CLASS
export const editClass = async (req, res) => {
  try {
    const { id } = req.params; // class id

    const {
      title,
      mentor,
      description,
      status,
      startDate,
      category,
      level,
      price,
      amount,
      language,
    } = req.body;

    if (!title || !mentor || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Title, mentor and date are required",
      });
    }

    const thumbnail = req.file ? req.file.path : null;

    const finalAmount =
      price === "Paid" && amount ? Number(amount) : 0;

    const updateQuery = `
      UPDATE classes
      SET
        class_title = $1,
        mentor_name = $2,
        class_date  = $3,
        category    = $4,
        level       = $5,
        price_type  = $6,
        amount      = $7,
        language    = $8,
        status      = $9,
        thumbnail   = COALESCE($10, thumbnail),
        description = $11
      WHERE id = $12
      RETURNING *
    `;

    const values = [
      title,        // $1
      mentor,       // $2
      startDate,    // $3
      category,     // $4
      level,        // $5
      price,        // $6
      finalAmount,  // $7
      language,     // $8
      status,       // $9
      thumbnail,    // $10
      description, // $11
      id,           // $12
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Edit Class Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// 
export const getInstructorTotalCount = async (req, res) => {
  try {
    const instructorId = req.instructor.id;   // current instructor id

    const query = `
      SELECT
        (SELECT COUNT(*) FROM courses WHERE instructor_id = $1) AS total_courses,
        (SELECT COUNT(*) FROM classes WHERE instructor_id = $1) AS total_classes
    `;

    const { rows } = await pool.query(query, [instructorId]);

    res.status(200).json({
      success: true,
      totalCourses: Number(rows[0].total_courses),
      totalClasses: Number(rows[0].total_classes),
    });
  } catch (error) {
    console.error("Get Instructor Total Count Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total courses and classes",
    });
  }
};
// 
export const uploadClassPdf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "PDF required" });
    }

    const pdfUrl = `http://localhost:3000/uploads/pdfs/${req.file.filename}`;

    await pool.query(
      "UPDATE classes SET pdf_notes = $1 WHERE id = $2",
      [pdfUrl, id]
    );

    res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      pdf: pdfUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
// GET CLASS BY ID
// GET single class by ID
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
    }

    const query = `
      SELECT
        id,
        class_title   AS title,
        mentor_name   AS mentor,
        class_date    AS startDate,
        category,
        level,
        price_type    AS price,
        amount,
        language,
        status,
        thumbnail,
        description,
        created_at,
        updated_at,
        instructor_id
      FROM classes
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get Class By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch class data",
    });
  }
};
// 
// controller
export const updateInstructorProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      specialization,
      linkedin_url,
     twitter_url,
      github_url,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE instructors
      SET
        name = $1,
        phone = $2,
        specialization = $3,
        linkedin_url = $4,
        twitter_url = $5,
        github_url = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        name,
        phone,
        specialization,
        linkedin_url,
        twitter_url,
        github_url,
        req.instructor.id,
      ]
    );

    res.json({
      success: true,
      instructor: result.rows[0],
    });
  } catch (error) {
    console.error("Update Instructor Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
