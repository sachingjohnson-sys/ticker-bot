import { dbConfig } from "./src/config/db.config.js";
const config =  {
  development: {
    ...dbConfig,
    migrations: {
      directory: "./src/infrastructure/database/migrations",
      extension: "ts"
    },
  },
};
export default config;