import pool from "../config/db.js";

export const createPopup = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Deactivate existing popups
    await pool.query(
      "UPDATE popup_messages SET active = false"
    );

    // Insert new popup
    const result = await pool.query(
      `INSERT INTO popup_messages (message, active)
       VALUES ($1, true)
       RETURNING *`,
      [message]
    );

    res.status(201).json({
      message: "Popup message saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create popup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GETTING ACTIVE POPU MESSAGE
export const getActivePopup = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT message
       FROM popup_messages
       WHERE active = true
       ORDER BY id DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Fetch popup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// 
export const getAllPopups = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, message, active, created_at, updated_at
       FROM popup_messages
       ORDER BY id DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get all popups error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
// 
export const activatePopup = async (req, res) => {
  const { id } = req.params;

  try {
    // Deactivate all popups first
    await pool.query(
      "UPDATE popup_messages SET active = false"
    );

    // Activate selected popup
    const result = await pool.query(
      `UPDATE popup_messages
       SET active = true
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Popup not found" });
    }

    res.json({
      success: true,
      message: "Popup activated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Activate popup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DEACTIVATE POPUP API
export const deactivatePopup = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE popup_messages
       SET active = false
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Popup not found" });
    }

    res.json({
      success: true,
      message: "Popup deactivated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Deactivate popup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE POPUP CONTROLLER
export const deletePopup = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM popup_messages
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Popup not found" });
    }

    res.json({
      success: true,
      message: "Popup deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Delete popup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};