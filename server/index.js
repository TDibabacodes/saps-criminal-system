const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/suspects", require("./routes/suspects"));
app.use("/api/records",  require("./routes/records"));
app.use("/api/managers", require("./routes/managers"));

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "SAPS API is running " }));

// ─── START SERVER ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));