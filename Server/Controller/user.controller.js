import pool from '../config/db.js'
import crypto from "crypto";
import { createHmac } from "crypto";



// SEND CONTACT MESSAGE
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const result = await pool.query(
      `INSERT INTO contacts (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, message]
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// CHECK AUTH
// CHECK LOGIN TO RETURN CURRENT USERNAME
export const checkLogin = (req, res) => {
  if (!req.user) {
    return res.json({ loggedIn: false });
  }
  console.log(req.user.username)

  return res.json({
    loggedIn: true,
    username: req.user.username,
    email: req.user.email,
    id: req.user.id
  });
}
// GET CLASSES
export const getClasses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        image_url,
        level,
        category,
        type,
        price
      FROM courses
      ORDER BY id DESC
    `);

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
// GET COURSES
export const getCourses = async (req, res) => {
  try {
    const approvedCourses = await pool.query(
      `
      SELECT 
        id,
        name,
        image_url,
        level,
        category,
        type,
        price,
        status,
        created_at
      FROM courses
      WHERE status = 'approved'
      ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      courses: approvedCourses.rows,
    });
  } catch (error) {
    console.error("Error fetching approved courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get approved courses",
    });
  }
};

// ENROLL USER IN COURSE
import Razorpay from "razorpay";
import nodemailer from "nodemailer";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const enrollCourse = async (req, res) => {
  try {
    const client_id = req.user.id;
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "course_id required",
      });
    }

    // Already enrolled?
    const already = await pool.query(
      "SELECT 1 FROM enrollments WHERE client_id=$1 AND course_id=$2",
      [client_id, course_id]
    );

    if (already.rows.length) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled",
      });
    }

    // Get course
    const courseRes = await pool.query(
      "SELECT id, name, price, type FROM courses WHERE id=$1",
      [course_id]
    );

    if (!courseRes.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const course = courseRes.rows[0];

    /*FREE COURSE*/
    if (course.type === "Free" || Number(course.price) === 0) {
      await pool.query(
        `
        INSERT INTO enrollments (client_id, course_id, payment_status)
        VALUES ($1,$2,'FREE')
        `,
        [client_id, course_id]
      );

      /*SEND EMAIL*/
      const transporter = nodemailer.createTransport({
        secure: true,
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: "ayushgupta.ce@gmail.com",
          pass: "fgul akxd mzsj kboa"// Gmail App Password
        },
      });

      const emailHTML = `
        <h2 style="color:#7C3AED;">DMV Learning</h2>

        <p>Dear <strong>${req.user.username}</strong>,</p>

        <p>🎉 You have successfully enrolled in the course:</p>

        <h3>${course.name}</h3>

        <p>You can now access all lectures and quizzes from your dashboard.</p>

        <br/>
        <p style="color:#555;">Happy Learning 🚀</p>
        <p><strong>DMV Learning Team</strong></p>
      `;

      await transporter.sendMail({
        to: req.user.email,
        from: `"DMV Learning" <${process.env.EMAIL_USER}>`,
        subject: "Course Enrollment Confirmation",
        html: emailHTML,
      });

      console.log("Enrollment email sent successfully");

      return res.status(201).json({
        success: true,
        message: "Enrolled successfully (Free)",
      });
    }

    /*PAID COURSE*/
    const order = await razorpay.orders.create({
      amount: Number(course.price) * 100,
      currency: "INR",
      receipt: `rcpt_${client_id}_${course_id}`,
    });

    return res.status(200).json({
      success: true,
      order,
      course,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("Enroll Error:", err);
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};


// VERIFY PAYEMNT API

export const verifyPayment = async (req, res) => {
  try {
    const client_id = req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      course_id,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // prevent duplicate enroll
    const exists = await pool.query(
      "SELECT 1 FROM enrollments WHERE client_id=$1 AND course_id=$2",
      [client_id, course_id]
    );

    if (exists.rows.length) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled",
      });
    }

    // insert enrollment
    await pool.query(
      `
      INSERT INTO enrollments
      (client_id, course_id, payment_id, order_id, payment_status)
      VALUES ($1,$2,$3,$4,'SUCCESS')
      `,
      [client_id, course_id, razorpay_payment_id, razorpay_order_id]
    );

    /*NODEMAILER INSIDE*/

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ayushgupta.ce@gmail.com",
        pass: "fgul akxd mzsj kboa", // Gmail App Password
      },
    });

    const userRes = await pool.query(
      "SELECT email, username FROM client WHERE id=$1",
      [client_id]
    );

    const userEmail = userRes.rows[0]?.email;
    const username = userRes.rows[0]?.username;

    if (userEmail) {
      await transporter.sendMail({
        from: `"DMV Learning" <${process.env.MAIL_USER}>`,
        to: userEmail,
        subject: "Course Enrollment Successful 🎉",
        html: `
          <h2>Hello ${username || "Student"},</h2>
          <p>Your payment was successful and you are now enrolled.</p>
          <p><b>Course ID:</b> ${course_id}</p>
          <p><b>Payment ID:</b> ${razorpay_payment_id}</p>
          <p><b>Oder ID:</b> ${razorpay_order_id}</p>
          <br/>
          <p>Happy Learning 🚀</p>
          <p><b>DMV Learning Team</b></p>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified & enrolled",
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};



// GET ENROLLED COURSES

export const getEnrolledCourses = async (req, res) => {
  try {
    const client_id = req.user.id; //from JWT middleware
    console.log(client_id)
    const result = await pool.query(
      `
      SELECT
        c.id,
        c.name,
        c.image_url,
        c.level,
        c.category,
        c.type,
        c.price,
        c.duration,
        c.certificate_of_completion,
        c.full_lifetime_access,
        e.enrolled_at
      FROM enrollments e
      INNER JOIN courses c
        ON c.id = e.course_id
      WHERE e.client_id = $1
      ORDER BY e.enrolled_at DESC
      `,
      [client_id]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get My Enrolled Courses Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};
// Lecture fetch

export const getLecturesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        course_id,
        course_title,
        lecture_title,
        lecture_url,
        created_at
      FROM lectures
      WHERE course_id = $1
      ORDER BY created_at ASC
      `,
      [courseId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Lectures By Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lectures",
    });
  }
};
// GET COURSES ACCORDING TO COURSE_ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.name,
        c.description,
        c.image_url,
        c.level,
        c.category,
        c.type,
        c.price,
        c.duration,
        c.total_lectures,
        c.total_quizzes,
        c.certificate_of_completion,
        c.full_lifetime_access,
        c.created_at,
        i.name AS instructor_name
      FROM courses c
      JOIN instructors i 
        ON c.instructor_id = i.id
      WHERE c.id = $1
      `,
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Get Course By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
    });
  }
};



// TOP 4 COURSES
// GET /user/courses/top
export const top_courses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        category,
        image_url,
        level
      FROM courses
      ORDER BY id DESC
      LIMIT 3
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Top Courses Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET ALL ENROLLED COURSES
// GET ALL ENROLLED COURSES (NO LOGIN REQUIRED)
// GET ALL ENROLLED COURSE DETAILS (NO LOGIN REQUIRED)
export const getAllEnrolledCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id AS enrollment_id,
        e.client_id,
        e.course_id,
        e.enrolled_at,
        e.payment_status,

        c.name,
        c.image_url,
        c.level,
        c.category,
        c.type,
        c.price,
        c.duration,
        c.certificate_of_completion,
        c.full_lifetime_access,
        c.description,
        c.instructor_name
      FROM enrollments e
      INNER JOIN courses c
        ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
    `);

    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get All Enrolled Courses Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};
// GET TOTAL NUMBER OF ENROLLED USERS
export const getEnrolledUsersCount = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(DISTINCT c.id) AS total_users
      FROM client c
      INNER JOIN enrollments e
      ON e.client_id = c.id
    `);

    return res.status(200).json({
      success: true,
      totalUsers: Number(result.rows[0].total_users),
    });

  } catch (error) {
    console.error("Get Enrolled Users Count Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled users count",
    });
  }
};
// GET TOP 3 ENROLLED COURSES
export const getTopEnrolledCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.image_url,
        c.level,
        c.category,
        c.price,
        c.duration,
        COUNT(e.course_id) AS total_enrollments
      FROM enrollments e
      INNER JOIN courses c
      ON e.course_id = c.id
      GROUP BY c.id
      ORDER BY total_enrollments DESC
      LIMIT 3
    `);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get Top Enrolled Courses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top enrolled courses",
    });
  }
};
// RATINGS ADD OR UPDATE
export const Ratings = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { lecture_id, rating } = req.body;

    if (!lecture_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "lecture_id and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    await pool.query(
      `
      INSERT INTO ratings (user_id, lecture_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, lecture_id)
      DO UPDATE SET
        rating = EXCLUDED.rating,
        updated_at = CURRENT_TIMESTAMP
      `,
      [userId, lecture_id, rating]
    );

    return res.status(200).json({
      success: true,
      message: "Rating saved successfully",
    });
  } catch (error) {
    console.error("Add/Update Rating Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save rating",
    });
  }
};
// GET LECTURE RATING OF CURRENT LOGGED IN USER
export const getLectureRating = async (req, res) => {
  try {
    const userId = req.user.id; // from IsLoggedIn middleware
    const { lecture_id } = req.params;

    if (!lecture_id) {
      return res.status(400).json({
        success: false,
        message: "lecture_id is required",
      });
    }

    const result = await pool.query(
      `
      SELECT rating
      FROM ratings
      WHERE user_id = $1 AND lecture_id = $2
      `,
      [userId, lecture_id]
    );

    return res.status(200).json({
      success: true,
      rating: result.rows[0]?.rating || 0, // ✅ return 0 if not rated
    });
  } catch (error) {
    console.error("Get User Rating Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rating",
    });
  }
};
// GET TOTAL NUMBER OF RATINGS

export const getTotalRatingsCount = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS total_ratings FROM ratings"
    );

    res.status(200).json({
      success: true,
      total_ratings: Number(result.rows[0].total_ratings),
    });
  } catch (error) {
    console.error("Error fetching ratings count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total ratings",
    });
  }
};
// CHECK COURSE ENROLLMENTS
export const checkCourseEnrollment = async (req, res) => {
  try {
    const clientId = req.user.id;          // logged-in user id
    const { course_id } = req.params;      // course id from URL

    const query = `
      SELECT 1
      FROM enrollments
      WHERE client_id = $1 AND course_id = $2
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [clientId, course_id]);

    res.status(200).json({
      success: true,
      enrolled: rows.length > 0, // ✅ true or false
    });
  } catch (error) {
    console.error("Enrollment check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check enrollment status",
    });
  }
};
// 
export const getAttemptedQuizzes = async (req, res) => {
  try {
    const user_id = req.user.id; // from IsLoggedIn middleware

    const { rows } = await pool.query(
      `
      SELECT 
        q.id AS quiz_id,
        q.title,
        qa.total_questions,
        qa.score,
        ROUND(
          (qa.score::DECIMAL / NULLIF(qa.total_questions, 0)) * 100,
          2
        ) AS percentage,
        qa.status,
        qa.started_at,
        qa.submitted_at
      FROM quizzes q
      INNER JOIN quiz_attempts qa
        ON qa.quiz_id = q.id
      WHERE qa.user_id = $1
      ORDER BY qa.started_at DESC
      `,
      [user_id]
    );

    res.status(200).json({
      success: true,
      total: rows.length,
      quizzes: rows,
    });

  } catch (error) {
    console.error("getAttemptedQuizzes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
