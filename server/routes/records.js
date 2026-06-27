const router = require("express").Router();
const pool   = require("../config/db");
const auth   = require("../middleware/auth");

// ─── GET ALL OFFENCES (for dropdown) ─────────────────────────
// GET /api/records/offences
router.get("/offences", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM offences ORDER BY offence_name"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET SINGLE RECORD ───────────────────────────────────────
// GET /api/records/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cr.*, o.offence_name
       FROM criminal_records cr
       JOIN offences o ON cr.offence_id = o.offence_id
       WHERE cr.record_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── AUTO-ALLOCATE CASE MANAGER ──────────────────────────────
// Finds the manager with the fewest cases assigned
async function allocateCaseManager() {
  const result = await pool.query(
    `SELECT cm.manager_id, COUNT(cr.record_id) AS case_count
     FROM case_managers cm
     LEFT JOIN criminal_records cr ON cm.manager_id = cr.manager_id
     GROUP BY cm.manager_id
     ORDER BY case_count ASC
     LIMIT 1`
  );
  return result.rows[0]?.manager_id;
}

// ─── ADD NEW CRIMINAL RECORD ──────────────────────────────────
// POST /api/records
router.post("/", auth, async (req, res) => {
  const { suspect_id, offence_id, sentence, issued_at, issued_by, issue_date, status } = req.body;
  try {
    const manager_id = await allocateCaseManager();
    const result = await pool.query(
      `INSERT INTO criminal_records
         (suspect_id, offence_id, sentence, issued_at, issued_by, issue_date, manager_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [suspect_id, offence_id, sentence, issued_at, issued_by, issue_date, manager_id, status || "Open"]
    );
    res.status(201).json({ message: "Criminal record added", record: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ─── EDIT CRIMINAL RECORD ─────────────────────────────────────
// PUT /api/records/:id
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { offence_id, sentence, issued_at, issued_by, issue_date, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE criminal_records
       SET offence_id=$1, sentence=$2, issued_at=$3,
           issued_by=$4, issue_date=$5, status=$6
       WHERE record_id=$7 RETURNING *`,
      [offence_id, sentence, issued_at, issued_by, issue_date, status || "Open", id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record updated", record: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// DELETE /api/records/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM criminal_records WHERE record_id = $1",
      [req.params.id]
    );
    res.json({ message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;