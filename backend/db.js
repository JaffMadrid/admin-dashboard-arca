const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "converse",
  port: 5432,
  database: "Db_Reciclaje"
});

module.exports = pool;