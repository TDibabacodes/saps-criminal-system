const { Pool } = require("pg");
require("dotenv").config();

// This creates a connection pool to PostgreSQL database
// It reads the credentials from.env file
const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,
});

module.exports = pool;