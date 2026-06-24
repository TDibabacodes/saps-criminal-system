const pool   = require("./config/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seed() {
  const password = await bcrypt.hash("password123", 10);

  await pool.query("DELETE FROM users");

  await pool.query(
    `INSERT INTO users (username, password, role) VALUES
      ($1, $2, 'officer'),
      ($3, $4, 'manager')`,
    ["officer1", password, "manager1", password]
  );

  console.log("✅ Done! Created two users:");
  console.log("   Username: officer1  | Password: password123");
  console.log("   Username: manager1  | Password: password123");
  process.exit();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});