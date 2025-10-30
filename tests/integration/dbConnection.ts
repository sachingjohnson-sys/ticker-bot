import knex from "knex";
import knexConfig from "../../knexfile.js"

const db = knex(knexConfig.development);

async function testConnection() {
  try {
    const result = await db.raw("SELECT 1+1 AS result");
    console.log("DB connection works:", result.rows[0]);
  } catch (err) {
    console.error("DB connection failed:", err);
  } finally {
    await db.destroy();
  }
}

testConnection();