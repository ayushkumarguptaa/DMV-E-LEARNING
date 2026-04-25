import pool from "../config/db.js";


// Add instructor
export const addInstructor = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      specialization,
      linkedin_url,
      twitter_url,
      instagram_url,
      github_url,
    } = req.body;
    console.log(name)
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Upload failed" });
    }

    // return res.json({
    //   id: Date.now().toString(),
    //   url: req.file.path,  // Cloudinary URL
    // });
    let profile_image = req.file.path;

    if (!name || !phone || !email || !specialization) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const result = await pool.query(
      `INSERT INTO instructors
      (name, phone, email, specialization, linkedin_url, twitter_url, instagram_url, github_url, profile_image)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        name,
        phone,
        email,
        specialization,
        linkedin_url,
        twitter_url,
        instagram_url,
        github_url,
        profile_image,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Instructor added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Add Instructor Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Get Instructor
export const getInstructors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        phone,
        email,
        specialization,
        linkedin_url,
        twitter_url,
        github_url
      FROM instructors
      ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Instructors Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructors",
    });
  }
};


// DELETE INSTRUCTOR

export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM instructors WHERE id = $1",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    console.error("Delete instructor error", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete instructor",
    });
  }
};


// 
// controller/admin.controller.js




// UPLOAD LECTURES

export const uploadLecture = async (req, res) => {
  try {
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "course_id is required",
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Lecture video upload failed",
      });
    }

    /* ===== GET COURSE TITLE FROM COURSES TABLE ===== */
    const courseResult = await pool.query(
      `SELECT name FROM courses WHERE id = $1`,
      [course_id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseTitle = courseResult.rows[0].name;
    const lectureUrl = req.file.path;

    /* ===== INSERT NEW LECTURE (MULTIPLE ALLOWED) ===== */
    const result = await pool.query(
      `
      INSERT INTO lectures
      (course_id, course_title, lecture_title, lecture_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [course_id, courseTitle, courseTitle, lectureUrl]
    );

    res.status(201).json({
      success: true,
      message: "Lecture uploaded successfully",
      lecture: result.rows[0],
    });
  } catch (error) {
    console.error("Upload Lecture Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET LECTURES VIDEO
export const getLecturesByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const result = await pool.query(
      `
      SELECT id, lecture_title, lecture_url
      FROM lectures
      WHERE course_id = $1
      ORDER BY created_at ASC
      `,
      [course_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Lectures Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lectures",
    });
  }
};
// GET TOTAL NUMBER OF STUDENT
export const getTotalClients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS total_clients FROM client`
    );

    res.status(200).json({
      success: true,
      totalClients: Number(result.rows[0].total_clients),
    });
  } catch (error) {
    console.error("Get Total Clients Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total clients",
    });
  }
};
// DASHBOARD API ENROLLMENTS DETAILS

export const getDashboardEnrollments = async (req, res) => {
  try {
    const query = `
      SELECT
        c.id           AS client_id,      -- ✅ client id added
        c.username     AS client_name,
        c.email        AS client_email,
        co.name        AS course_name,
        e.payment_id,
        e.order_id,
        e.payment_status
      FROM enrollments e
      JOIN client c ON e.client_id = c.id
      JOIN courses co ON e.course_id = co.id
      ORDER BY e.id DESC;
    `;

    const { rows } = await pool.query(query);

    res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Enrollment fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment details",
    });
  }
};
// GET TOTAL ENROLLMENTS AMOUNT
export const getTotalEnrollmentAmount = async (req, res) => {
  try {
    const query = `
      SELECT
        COALESCE(SUM(co.price), 0) AS total_amount
      FROM enrollments e
      JOIN courses co ON e.course_id = co.id
      WHERE e.payment_status = 'SUCCESS';
    `;

    const { rows } = await pool.query(query);

    res.status(200).json({
      success: true,
      totalAmount: Number(rows[0].total_amount),
    });
  } catch (error) {
    console.error("Total amount fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total enrollment amount",
    });
  }
};
// 
// controllers/courseController.js
export const getAllCoursesForAdmin = async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        name,
        image_url,
        level,
        category,
        type,
        price,
        created_at
      FROM courses
      ORDER BY id DESC
    `;

    const { rows } = await pool.query(query);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get All Courses Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};
//

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM courses
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
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


// Approve Course
export const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE courses SET status = 'approved' WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Course approved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to approve course",
    });
  }
};


// Reject Course
export const rejectCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE courses SET status = 'rejected' WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Course rejected successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to reject course",
    });
  }
};
// 
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
// 
export const getClasses = async (req, res) => {
  try {
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
      ORDER BY id DESC
    `;

    const { rows } = await pool.query(query);

    res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Get Classes Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
    });
  }
};
// 
export const getAllClassesForAdmin = async (req, res) => {
  try {
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
      ORDER BY id DESC
    `;

    const { rows } = await pool.query(query);

    res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Get All Classes Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
    });
  }
};
