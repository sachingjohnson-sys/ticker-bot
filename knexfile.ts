import { dbConfig } from "./src/config/db.config.js";
const config =  {
  development: {
    ...dbConfig,
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
  },
};
export default config;
