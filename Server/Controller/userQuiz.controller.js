import pool from "../config/db.js";

//get user attempts 
export const getUserQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT q.id, q.title, q.course_id
      FROM quizzes q
      JOIN enrollments e ON e.course_id = q.course_id
      WHERE e.client_id = $1
      ORDER BY q.created_at DESC
      `,
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("USER QUIZ LIST ERROR:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
  }
};

//start quiz
export const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    //Enrollment check
    const check = await pool.query(
      `
      SELECT 1 FROM quizzes q
      JOIN enrollments e ON e.course_id = q.course_id
      WHERE q.id=$1 AND e.client_id=$2
      `,
      [quizId, userId]
    );

    if (check.rowCount === 0) {
      return res.status(403).json({
        success: false,
        message: "Not enrolled",
      });
    }

    //CREATE / UPDATE ATTEMPT (IN_PROGRESS)
    await pool.query(
      `
      INSERT INTO quiz_attempts (user_id, quiz_id, status, started_at)
      VALUES ($1, $2, 'in_progress', NOW())
      ON CONFLICT (user_id, quiz_id)
      DO UPDATE SET
        status = 'in_progress',
        started_at = NOW()
      `,
      [userId, quizId]
    );

    // Quiz details
    const quizRes = await pool.query(
      `
      SELECT id, title, duration_minutes,
             shuffle_questions, shuffle_options,
             allow_tab_switch, fullscreen_required
      FROM quizzes
      WHERE id=$1
      `,
      [quizId]
    );

    // Questions
    const qRes = await pool.query(
      `
      SELECT id, question, options
      FROM quiz_questions
      WHERE quiz_id=$1
      `,
      [quizId]
    );

    res.json({
      success: true,
      data: {
        ...quizRes.rows[0],
        questions: qRes.rows,
      },
    });

  } catch (err) {
    console.error("START QUIZ ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to start quiz",
    });
  }
};

//submit quiz
export const submitQuiz = async (req, res) => {
  let client;

  try {
    const userId = req.user.id;
    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission",
      });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    //GET ATTEMPT
    const attemptRes = await client.query(
      `
      SELECT id, status
      FROM quiz_attempts
      WHERE user_id=$1 AND quiz_id=$2
      `,
      [userId, quizId]
    );

    if (attemptRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Quiz not started",
      });
    }

    if (attemptRes.rows[0].status === "completed") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Quiz already submitted",
      });
    }

    const attemptId = attemptRes.rows[0].id;

    //Fetch correct answers
    const qRes = await client.query(
      `
      SELECT id, correct_index
      FROM quiz_questions
      WHERE quiz_id=$1
      `,
      [quizId]
    );

    const answerMap = new Map(
      qRes.rows.map(q => [q.id, q.correct_index])
    );

    let score = 0;

    // Save answers
    for (const a of answers) {
      const correctIndex = answerMap.get(a.questionId);
      const isCorrect = a.selectedIndex === correctIndex;

      if (isCorrect) score++;

      await client.query(
        `
        INSERT INTO quiz_answers
        (attempt_id, question_id, selected_index, is_correct)
        VALUES ($1,$2,$3,$4)
        `,
        [attemptId, a.questionId, a.selectedIndex, isCorrect]
      );
    }

    //UPDATE ATTEMPT → COMPLETED
    await client.query(
      `
      UPDATE quiz_attempts
      SET
        score = $1,
        total_questions = $2,
        status = 'completed',
        submitted_at = NOW()
      WHERE id = $3
      `,
      [score, qRes.rows.length, attemptId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      data: {
        score,
        total: qRes.rows.length,
      },
    });

  } catch (err) {
    if (client) await client.query("ROLLBACK");

    console.error("SUBMIT QUIZ ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });

  } finally {
    if (client) client.release();
  }
};
