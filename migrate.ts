import "dotenv/config";
import knexPkg from "knex";
import knexfile from "./knexfile.ts"; // notice the `.ts` extension

const knex = knexPkg(knexfile.development);

async function runMigrations() {
  try {
    await knex.migrate.latest();
    console.log("Migration completed successfully");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await knex.destroy();
    process.exit(0);
  }
}

runMigrations();