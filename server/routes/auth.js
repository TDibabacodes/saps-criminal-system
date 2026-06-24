const router  = require("express").Router();
const pool    = require("../config/db");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

// ─── REGISTER ───────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Hash the password before saving (never save plain text passwords)
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, hashed, role || "officer"]
    );
    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────
// POST /api/auth/login
// Logs in and returns a JWT token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user in database
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token valid for 8 hours
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;