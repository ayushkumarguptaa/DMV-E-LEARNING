import pool from "../config/db.js";

//courses get all
export const getCoursesForQuiz = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name FROM courses ORDER BY name`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("GET COURSES ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

//Quiz save
export const saveAIGeneratedQuiz = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      courseId,
      title,
      shuffleQuestions,
      shuffleOptions,
      allowTabSwitch,
      fullscreenRequired,
      durationMinutes,
      questions,
    } = req.body;

    if (!courseId || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "courseId and questions are required",
      });
    }
    if (!durationMinutes || durationMinutes <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz duration is required",
      });
    }


    await client.query("BEGIN");

    //INSERT QUIZ
    const quizRes = await client.query(
      `
      INSERT INTO quizzes
      (course_id, title, shuffle_questions, shuffle_options, allow_tab_switch, fullscreen_required, duration_minutes)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
      `,
      [
        courseId,
        title || "AI Generated Quiz",
        shuffleQuestions ?? false,
        shuffleOptions ?? false,
        allowTabSwitch ?? false,
        fullscreenRequired ?? true,
        durationMinutes,
      ]
    );

    const quizId = quizRes.rows[0].id;

    //INSERT QUESTIONS
    for (const q of questions) {
      await client.query(
        `
        INSERT INTO quiz_questions
        (quiz_id, question, options, correct_index)
        VALUES ($1,$2,$3,$4)
        `,
        [quizId, q.question, JSON.stringify(q.options), q.correctIndex]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "AI Quiz saved successfully",
      quizId,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("SAVE AI QUIZ ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};
