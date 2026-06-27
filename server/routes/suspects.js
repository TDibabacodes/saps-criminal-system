const router = require("express").Router();
const pool   = require("../config/db");
const auth   = require("../middleware/auth");

// ─── ADD NEW SUSPECT ─────────────────────────────────────────
// POST /api/suspects
router.post("/", auth, async (req, res) => {
  const { id_number, first_name, last_name } = req.body;
  try {
    // Check if suspect with this ID already exists
    const existing = await pool.query(
      "SELECT * FROM suspects WHERE id_number = $1",
      [id_number]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Suspect with this ID already exists" });
    }

    const result = await pool.query(
      `INSERT INTO suspects (id_number, first_name, last_name)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_number, first_name, last_name]
    );
    res.status(201).json({
      message: "Suspect added successfully",
      suspect: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── SEARCH SUSPECT BY ID NUMBER ─────────────────────────────
// GET /api/suspects/search?id_number=xxx
router.get("/search", auth, async (req, res) => {
  const { id_number } = req.query;
  try {
    const suspectResult = await pool.query(
      "SELECT * FROM suspects WHERE id_number = $1",
      [id_number]
    );

    if (suspectResult.rows.length === 0) {
      return res.status(404).json({ message: "Suspect not found" });
    }

    const suspect = suspectResult.rows[0];

    // Get all their criminal records with offence name and manager name
    const recordsResult = await pool.query(
      `SELECT cr.record_id, cr.suspect_id, cr.sentence,
              cr.issued_at, cr.issued_by, cr.issue_date,
              o.offence_name,
              cm.first_name AS manager_first,
              cm.last_name  AS manager_last
       FROM criminal_records cr
       JOIN offences o       ON cr.offence_id  = o.offence_id
       LEFT JOIN case_managers cm ON cr.manager_id = cm.manager_id
       WHERE cr.suspect_id = $1
       ORDER BY cr.created_at DESC`,
      [suspect.suspect_id]
    );

    res.json({ suspect, records: recordsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET SINGLE SUSPECT BY DB ID ─────────────────────────────
// GET /api/suspects/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM suspects WHERE suspect_id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Suspect not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── EDIT SUSPECT ─────────────────────────────────────────────
// PUT /api/suspects/:id
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, id_number } = req.body;
  try {
    const result = await pool.query(
      `UPDATE suspects
       SET first_name=$1, last_name=$2, id_number=$3
       WHERE suspect_id=$4 RETURNING *`,
      [first_name, last_name, id_number, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Suspect not found" });
    }
    res.json({ message: "Suspect updated", suspect: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET ALL SUSPECTS (for dashboard) ────────────────────────
// GET /api/suspects
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.suspect_id, s.id_number, s.first_name, s.last_name,
              COUNT(cr.record_id) AS total_offences
       FROM suspects s
       LEFT JOIN criminal_records cr ON s.suspect_id = cr.suspect_id
       GROUP BY s.suspect_id
       ORDER BY total_offences DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/suspects/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM suspects WHERE suspect_id = $1",
      [req.params.id]
    );
    res.json({ message: "Suspect deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;