const router  = require("express").Router();
const pool    = require("../config/db");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

// ─── REGISTER ───────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, hashed, role || "officer"]
    );
    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    if (err.code === "23505") {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: err.message });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;