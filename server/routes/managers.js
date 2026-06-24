const router = require("express").Router();
const pool   = require("../config/db");
const auth   = require("../middleware/auth");

// ─── GET ALL MANAGERS WITH CASE COUNTS ───────────────────────
// GET /api/managers
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cm.manager_id, cm.first_name, cm.last_name, cm.email,
              COUNT(cr.record_id) AS case_count
       FROM case_managers cm
       LEFT JOIN criminal_records cr ON cm.manager_id = cr.manager_id
       GROUP BY cm.manager_id
       ORDER BY cm.last_name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET ALL CASES FOR A SPECIFIC MANAGER ────────────────────
// GET /api/managers/:id/cases
router.get("/:id/cases", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const managerResult = await pool.query(
      "SELECT * FROM case_managers WHERE manager_id = $1",
      [id]
    );
    if (managerResult.rows.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const casesResult = await pool.query(
      `SELECT cr.record_id, cr.sentence, cr.issued_at, cr.issued_by, cr.issue_date,
              s.first_name, s.last_name, s.id_number,
              o.offence_name
       FROM criminal_records cr
       JOIN suspects s ON cr.suspect_id = s.suspect_id
       JOIN offences o ON cr.offence_id  = o.offence_id
       WHERE cr.manager_id = $1
       ORDER BY cr.created_at DESC`,
      [id]
    );

    res.json({ manager: managerResult.rows[0], cases: casesResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;