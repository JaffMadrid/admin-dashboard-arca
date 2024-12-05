const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  host: "aws-0-us-east-1.pooler.supabase.com",
  user: "postgres.qosipqholeuqktoerwwy",
  password: process.env.DB_PASSWORD,
  port: 6543,
  database: "postgres"
});

module.exports = pool;